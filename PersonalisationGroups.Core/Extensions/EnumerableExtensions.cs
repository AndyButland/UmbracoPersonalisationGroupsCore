using System.Collections.Generic;
using System.Linq;

namespace Our.Umbraco.PersonalisationGroups.Core.Extensions
{
    public static class EnumerableExtensions
    {
        public static bool ContainsAll<TSource>(this IEnumerable<TSource> source, IEnumerable<TSource> other) => !other.Except(source).Any();

        public static bool ContainsAny<TSource>(this IEnumerable<TSource> source, IEnumerable<TSource> other) => other.Any(source.Contains);
    }
}
