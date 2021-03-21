namespace Our.Umbraco.PersonalisationGroups.Criteria.PagesViewed
{
    public interface IUserActivityTracker
    {
        void TrackPageView(int pageId);
    }
}