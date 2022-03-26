namespace Our.Umbraco.PersonalisationGroups.Core.Providers.DateTime
{
    public class DateTimeProvider : IDateTimeProvider
    {
        public System.DateTime GetCurrentDateTime() => System.DateTime.Now;
    }
}
