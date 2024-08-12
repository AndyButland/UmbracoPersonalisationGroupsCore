using Microsoft.AspNetCore.Http;
using Our.Umbraco.PersonalisationGroups.Services;
using System;
using System.Threading.Tasks;
using Umbraco.Cms.Core.Web;
using Umbraco.Extensions;

namespace Our.Umbraco.PersonalisationGroups.Middleware;

internal class TrackUserActivityMiddleware : IMiddleware
{
    private readonly IUmbracoContextAccessor _umbracoContextAccessor;
    private readonly IUserActivityTracker _userActivityTracker;

    public TrackUserActivityMiddleware(IUmbracoContextAccessor umbracoContextAccessor, IUserActivityTracker userActivityTracker)
    {
        _umbracoContextAccessor = umbracoContextAccessor;
        _userActivityTracker = userActivityTracker;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (!_umbracoContextAccessor.TryGetUmbracoContext(out var umbracoContext))
        {
            await next(context);
            return ;
        }
            
        var isFrontEndRequest = umbracoContext.IsFrontEndUmbracoRequest();
        if (!isFrontEndRequest)
        {
            await next(context);
            return;
        }

        var pageKey = umbracoContext.PublishedRequest?.PublishedContent?.Key;
        if (pageKey == null)
        {
            await next(context);
            return;
        }

        _userActivityTracker.TrackPageView(pageKey.Value);

        _userActivityTracker.TrackSession();

        await next(context);
    }
}
