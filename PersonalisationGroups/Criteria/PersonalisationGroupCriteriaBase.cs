using System;
using System.Globalization;
using System.Text.RegularExpressions;

namespace Our.Umbraco.PersonalisationGroups.Criteria;

/// <summary>
/// Provides common base functionality for personalisation criteria
/// </summary>
public abstract class PersonalisationGroupCriteriaBase
{
    public virtual string ClientAssetsFolder => "PersonalisationGroups/Criteria";

    protected static bool MatchesValue(string? valueFromContext, string valueFromDefinition)
    {
        if (valueFromContext == null)
        {
            return false;
        }

        return string.Equals(valueFromContext, valueFromDefinition,
            StringComparison.InvariantCultureIgnoreCase);
    }

    protected static bool ContainsValue(string? valueFromContext, string valueFromDefinition)
    {
        if (valueFromContext == null)
        {
            return false;
        }

        return CultureInfo.InvariantCulture.CompareInfo
            .IndexOf(valueFromContext, valueFromDefinition, CompareOptions.IgnoreCase) >= 0;
    }

    protected static bool MatchesRegex(string? valueFromContext, string valueFromDefinition)
    {
        if (valueFromContext == null)
        {
            return false;
        }

        return Regex.IsMatch(valueFromContext, valueFromDefinition);
    }

    protected bool CompareValues(string? value, string definitionValue, Comparison comparison)
    {
        var result = DateCompare(value, definitionValue, comparison, out bool comparisonMade);
        if (comparisonMade)
        {
            return result;
        }
        result = NumericCompare(value, definitionValue, comparison, out comparisonMade);

        if (comparisonMade)
        {
            return result;
        }

        return StringCompare(value, definitionValue, comparison);
    }

    private static bool DateCompare(string? value, string definitionValue, Comparison comparison, out bool comparisonMade)
    {
        if (DateTime.TryParse(value, out DateTime dateValue) && DateTime.TryParse(definitionValue, out DateTime dateDefinitionValue))
        {
            comparisonMade = true;
            switch (comparison)
            {
                case Comparison.GreaterThan:
                    return dateValue > dateDefinitionValue;
                case Comparison.GreaterThanOrEqual:
                    return dateValue >= dateDefinitionValue;
                case Comparison.LessThan:
                    return dateValue < dateDefinitionValue;
                case Comparison.LessThanOrEqual:
                    return dateValue <= dateDefinitionValue;
            }
        }

        comparisonMade = false;
        return false;
    }

    private static bool NumericCompare(string? value, string definitionValue, Comparison comparison, out bool comparisonMade)
    {
        decimal decimalValue;
        if (decimal.TryParse(value, out decimalValue) && decimal.TryParse(definitionValue, out decimal decimalDefinitionValue))
        {
            comparisonMade = true;
            switch (comparison)
            {
                case Comparison.GreaterThan:
                    return decimalValue > decimalDefinitionValue;
                case Comparison.GreaterThanOrEqual:
                    return decimalValue >= decimalDefinitionValue;
                case Comparison.LessThan:
                    return decimalValue < decimalDefinitionValue;
                case Comparison.LessThanOrEqual:
                    return decimalValue <= decimalDefinitionValue;
            }
        }

        comparisonMade = false;
        return false;
    }

    private static bool StringCompare(string? value, string definitionValue, Comparison comparison)
    {
        var comparisonValue = string.Compare(value, definitionValue, StringComparison.InvariantCultureIgnoreCase);
        switch (comparison)
        {
            case Comparison.GreaterThan:
                return comparisonValue > 0;
            case Comparison.GreaterThanOrEqual:
                return comparisonValue >= 0;
            case Comparison.LessThan:
                return comparisonValue < 0;
            case Comparison.LessThanOrEqual:
                return comparisonValue <= 0;
        }

        return false;
    }
}
