namespace Our.Umbraco.PersonalisationGroups.Core.Services
{
    public interface IUserActivityTracker
    {
        void TrackPageView(int pageId);

        void TrackSession();
    }
}