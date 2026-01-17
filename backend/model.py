def predict_risk(data):
    rainfall = data.get("rainfall", 0)
    population = data.get("population", 0)
    elevation = data.get("elevation", 0)

    if rainfall > 2000 and population > 5:
        return {"risk": "HIGH", "score": 8.7}
    elif rainfall > 1000:
        return {"risk": "MEDIUM", "score": 5.5}
    else:
        return {"risk": "LOW", "score": 2.5}
