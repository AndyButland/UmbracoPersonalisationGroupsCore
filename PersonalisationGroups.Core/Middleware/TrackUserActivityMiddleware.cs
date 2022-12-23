using Microsoft.AspNetCore.Http;
using Our.Umbraco.PersonalisationGroups.Core.Services;
using System;
using System.Threading.Tasks;
using Umbraco.Cms.Core.Web;
using Umbraco.Extensions;

namespace Our.Umbraco.PersonalisationGroups.Core.Middleware
{
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

            var pageId = umbracoContext.PublishedRequest?.PublishedContent?.Id;
            if (pageId == null)
            {
                await next(context);
                return;
            }

            _userActivityTracker.TrackPageView(pageId.Value);

            _userActivityTracker.TrackSession();

            await next(context);
        }
    }
}
