namespace Our.Umbraco.PersonalisationGroups.Providers.DateTime
{
    public class DateTimeProvider : IDateTimeProvider
    {
        public System.DateTime GetCurrentDateTime() => System.DateTime.Now;
    }
}
