FROM nginx:stable
# Source: https://github.com/nodeintegration/nginx-modsecurity

ENV MODSECURITY_VERSION 2.9.3

RUN cd /opt && \
    echo "deb-src http://nginx.org/packages/debian/ jessie nginx" >> /etc/apt/sources.list && \
    apt update && apt -qy upgrade && \
    apt install -qy git wget dpkg-dev apache2-dev libpcre3-dev libxml2-dev && \
    apt source nginx && \
    apt -qy build-dep nginx

RUN wget -O /opt/modsecurity-${MODSECURITY_VERSION}.tar.gz https://www.modsecurity.org/tarball/${MODSECURITY_VERSION}/modsecurity-${MODSECURITY_VERSION}.tar.gz && \
    cd /opt && tar -zxvf modsecurity-${MODSECURITY_VERSION}.tar.gz

RUN cd /opt/modsecurity-${MODSECURITY_VERSION} && \
    ./configure --enable-standalone-module --disable-mlogc && \
    make

RUN cd /opt/nginx-* && \
    sed -i -e 's%\./configure%./configure --add-module=/opt/modsecurity-${MODSECURITY_VERSION}/nginx/modsecurity --with-http_stub_status_module%' debian/rules && \
    dpkg-buildpackage -b && \
    dpkg -i /opt/nginx_*.deb

RUN cp /opt/modsecurity-${MODSECURITY_VERSION}/modsecurity.conf-recommended /etc/nginx/modsecurity.conf && \
    cp /opt/modsecurity-${MODSECURITY_VERSION}/unicode.mapping /etc/nginx/

RUN cd /usr/src && \
    git clone https://github.com/SpiderLabs/owasp-modsecurity-crs.git

RUN apt --fix-broken -qy install && \
    apt remove -qy --purge git wget dpkg-dev apache2-dev libpcre3-dev libxml2-dev && \
    apt -qy autoremove && \
    rm -rf /opt/modsecurity-* && \
    rm -rf /opt/nginx*

RUN ln -sf /dev/stdout /var/log/modsec_audit.log
RUN mkdir /etc/nginx/modsecurity-data && \
    chown nginx: /etc/nginx/modsecurity-data && \
    cat /usr/src/owasp-modsecurity-crs/crs-setup.conf.example /usr/src/owasp-modsecurity-crs/rules/*.conf > /etc/nginx/modsecurity.conf && \
    cp /usr/src/owasp-modsecurity-crs/rules/*.data /etc/nginx/ && \
    sed -i -e 's%location / {%location / {\n        ModSecurityEnabled on;\n        ModSecurityConfig modsecurity.conf;%' /etc/nginx/conf.d/default.conf && \
    echo "SecAuditLog /var/log/modsec_audit.log" >> /etc/nginx/modsecurity.conf && \
    echo "SecRuleEngine On" >> /etc/nginx/modsecurity.conf && \
    #echo 'SecDefaultAction "phase:1,deny,log"' >> /etc/nginx/modsecurity.conf
    echo "SecDataDir /etc/nginx/modsecurity-data" >> /etc/nginx/modsecurity.conf

#RUN apt update -q && apt -qy upgrade
RUN apt -qy install python python-pip curl
RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -
RUN apt install -qy nodejs parallel
RUN pip install staticjinja

COPY minizoo.conf /etc/nginx/conf.d/
COPY ./minizoo /usr/share/nginx
WORKDIR /usr/share/nginx

RUN mkdir output output-min
RUN npm i
RUN ./build.sh -m

RUN rm -rf output/* && \
    rm -rf /var/lib/apt/lists/*

CMD ["nginx", "-g", "daemon off;"]
