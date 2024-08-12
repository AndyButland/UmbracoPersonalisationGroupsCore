using System;

namespace Our.Umbraco.PersonalisationGroups.Services;

public interface IUserActivityTracker
{
    void TrackPageView(Guid pageKey);

    void TrackSession();
}