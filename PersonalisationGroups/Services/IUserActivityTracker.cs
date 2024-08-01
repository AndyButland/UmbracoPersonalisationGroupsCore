namespace Our.Umbraco.PersonalisationGroups.Services
{
    public interface IUserActivityTracker
    {
        void TrackPageView(int pageId);

        void TrackSession();
    }
}