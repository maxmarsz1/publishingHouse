from rest_framework import serializers
from .models import AppSettings

class AppSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppSettings
        fields = '__all__'

    def validate(self, data):
        if data['abstract_min_words'] > data['abstract_max_words']:
             raise serializers.ValidationError("Minimalna liczba słów abstraktu nie może być większa od maksymalnej.")
        if data['review_min_words'] > data['review_max_words']:
             raise serializers.ValidationError("Minimalna liczba słów recenzji nie może być większa od maksymalnej.")
        return data
