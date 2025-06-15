import pandas as pd

class RiskAssessment:
    def __init__(self, data_quality, bias, explainability, robustness, privacy):
        self.data_quality = data_quality
        self.bias = bias
        self.explainability = explainability
        self.robustness = robustness
        self.privacy = privacy

    def total_score(self):
        return self.data_quality + self.bias + self.explainability + self.robustness + self.privacy

    def risk_level(self):
        score = self.total_score()
        if score >= 20:
            return "Low Risk"
        elif score >= 15:
            return "Moderate Risk"
        else:
            return "High Risk"
