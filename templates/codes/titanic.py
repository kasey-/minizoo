import numpy as np
import pandas as pd
import statistics
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import cross_val_score
from sklearn.externals import joblib

def compute_score(cfl, X, y):
    xval = cross_val_score(cfl, X, y, cv=5)
    return statistics.mean(xval)

df = pd.read_csv('./data/train.csv')

df = df[['Age', 'Sex', 'Pclass', 'Survived', 'Embarked', 'Fare']]

df = df.replace('male', 0)
df = df.replace('female', 1)

df['Age'] = df['Age'].fillna(df['Age'].mean())
df['is_child'] = df.Age < 8

df['Embarked'] = df['Embarked'].fillna(1)
df['Embarked'] = df['Embarked'].replace('S', 0)
df['Embarked'] = df['Embarked'].replace('C', 1)
df['Embarked'] = df['Embarked'].replace('Q', 2)

features = df[['is_child', 'Sex', 'Pclass', 'Embarked', 'Fare']]
target   = df['Survived']

X_train, X_test, y_train, y_test = train_test_split(features, target, test_size = 0.30)

rf = RandomForestClassifier()
rf.fit(X_train, y_train)

y_predicted = rf.predict(X_test)
outcome = pd.DataFrame(confusion_matrix(y_predicted, y_test), index = ['Not survived', 'Survived'], columns = ['Not survived', 'Survived'])
score = compute_score(rf, X_test, y_test)

print(score, outcome)
joblib.dump(rf, 'RandomForest.pkl')

passenger = [[1, 1, 1, 1, 1]]
print(rf.predict(passenger))
