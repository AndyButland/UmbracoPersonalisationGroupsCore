namespace Our.Umbraco.PersonalisationGroups.Core.Criteria.PagesViewed
{
    public interface IUserActivityTracker
    {
        void TrackPageView(int pageId);
    }
}