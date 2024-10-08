﻿using System;

namespace Our.Umbraco.PersonalisationGroups.Extensions;

public static class StringExtensions
{
    public static bool InvariantEquals(this string compare, string compareTo) => compare.Equals(compareTo, StringComparison.InvariantCultureIgnoreCase);

    public static bool InvariantEndsWith(this string compare, string compareTo) => compare.EndsWith(compareTo, StringComparison.InvariantCultureIgnoreCase);

    public static string TrimStart(this string value, string forRemoving)
    {
        if (string.IsNullOrEmpty(value))
        {
            return value;
        }

        if (string.IsNullOrEmpty(forRemoving))
        {
            return value;
        }

        while (value.StartsWith(forRemoving, StringComparison.InvariantCultureIgnoreCase))
        {
            value = value.Substring(forRemoving.Length);
        }

        return value;
    }

    public static string TrimEnd(this string value, string forRemoving)
    {
        if (string.IsNullOrEmpty(value))
        {
            return value;
        }

        if (string.IsNullOrEmpty(forRemoving))
        {
            return value;
        }

        while (value.EndsWith(forRemoving, StringComparison.InvariantCultureIgnoreCase))
        {
            value = value.Remove(value.LastIndexOf(forRemoving, StringComparison.InvariantCultureIgnoreCase));
        }

        return value;
    }

    public static string[] SplitByNewLine(this string text, StringSplitOptions options) => text.Split(new[] { "\r\n", "\r", "\n" }, options);
}
