# Umbraco Personalisation Groups

## What it does

Umbraco Personalisation Groups is an Umbraco package intended to allow personalisation of content to different groups of site visitors.

It supports Umbraco version 9+.  For Umbraco 7 and 8 support, you can find [source code and license details here](https://github.com/AndyButland/UmbracoPersonalisationGroups).

It can be installed from [NuGet](https://www.nuget.org/packages/UmbracoPersonalisationGroups).

It's listed on the [Umbraco Marketplace](https://marketplace.umbraco.com/package/umbracopersonalisationgroups).  And for older versions of the package on [our.umbraco.org](https://our.umbraco.org/projects/website-utilities/personalisation-groups).

It contains a few different pieces:

- An interface for and various implementations of different personalisation group criteria (e.g. "time of day", "day of week")
- Implementation of the following criteria:
	- Authentication status
    - Cookie key presence/absence and value matching
	- Country (via IP matching or CDN header)
    - Day of week
	- Month of year
	- Number of site visits
	- Pages viewed
	- Querystring
	- Referrer
	- Region (via IP matching)
    - Session key presence/absence and value matching
    - Time of day
	- Umbraco member group
	- Umbraco member profile field
	- Umbraco member type
- An extensible mechanism to allow other criteria to be created and loaded from other assemblies
- A property editor with associated angular controllers/views that provide the means of configuring personalisation groups based on the available criteria
- Extension methods on `IPublishedContent/IPublishedElement` and `UmbracoHelper` named `ShowToVisitor()` and `ScoreForVisitor()` that allows for showing, hiding or ordering content for the current site visitor

## Using the package

### Installation

Installation is via NuGet:

```
PM> Install-Package UmbracoPersonalisationGroups
```

The package includes a migration that will create the necessary document types, data types and root content nodes.

#### Umbraco 9-12

Once installed, the default Umbraco `StartUp.cs` class should be augmented with additional extension methods for registering the package: `AddPersonalisationGroups` and `UsePersonalisationGroupsEndpoints`.  When complete, it should look like this:

```
    public void ConfigureServices(IServiceCollection services) =>
        services.AddUmbraco(_env, _config)
            .AddBackOffice()
            .AddWebsite()
            .AddComposers()
            .AddPersonalisationGroups(_config)
            .Build();

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseUmbraco()
            .WithMiddleware(u =>
            {
                u.WithBackOffice();
                u.WithWebsite();
            })
            .WithEndpoints(u =>
            {
                u.UseInstallerEndpoints();
                u.UseBackOfficeEndpoints();
                u.UseWebsiteEndpoints();
                u.UsePersonalisationGroupsEndpoints();
            });
    }
```

#### Umbraco 13

From Umbraco 13+, the equivalent code will be in `Program.cs` and look like this:

```
using Our.Umbraco.PersonalisationGroups.Core;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddDeliveryApi()
    .AddComposers()
    .AddPersonalisationGroups(builder.Configuration)
    .Build();

WebApplication app = builder.Build();

await app.BootUmbracoAsync();


app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseInstallerEndpoints();
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
        u.UsePersonalisationGroupsEndpoints();
    });

await app.RunAsync();
```

#### Umbraco 14+

For Umbraco 14+, the addition of `u.UsePersonalisationGroupsEndpoints();` is not required and the namespace changes:

```
using Our.Umbraco.PersonalisationGroups;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddDeliveryApi()
    .AddComposers()
    .AddPersonalisationGroups(builder.Configuration)
    .Build();

WebApplication app = builder.Build();

await app.BootUmbracoAsync();


app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseInstallerEndpoints();
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

await app.RunAsync();
```

### Upgrades

To upgrade update the reference to the version of the NuGet package in your `.csproj` file and rebuild.

#### Version specific upgrade notes

Upgrading an Umbraco database that used the package with Umbraco 13 or below to Umbraco 14 will carry over your groups and definitions. Please note though breaking changes listed at the bottom of this document for version 4 of the package.

Once the database is upgraded you will need to carry out these two one-off actions:

- Navigate to _Settings > Data Types_ and find "Personalisation Group Definition"
- Note that the property editor will be defined as "personalisationGroupDefinition | Umbraco.Label"
- Click "Change" and select the editor "Personalisation Group Definition Editor"
- Save the data type

Not essential, but you will likely also find the "Personalisation Groups Folder" content node is missing an icon.  To fix:

- Navigate to _Settings > Document Types_ and find "Personalisation Groups Folder"
- Select an icon (`icon-folder` in green is the standard provided with a clean install)

### Example usage

 - Within the "Content" section, confirm or create a root node of type **Personalisation Groups Folder**, called **Personalisation Groups**
 - Switch to "Developer" and find the **Personalisation group picker** data type.  Set the root node to be the node you just created.
 - Back to "Content", as a child of the node you just created, create a node of type **Personalisation Group** called, for example, *Weekday morning visitors*
     - Set the **Match** option to **All**
	 - Set the **Duration in group** option to **Page**
	     - If you select other options here, the groups will become "sticky".  For example if someone comes to your home page that's personalised based on a querystring parameter, if they then return to the page by default they will no longer match the group (as the querystring value is no longer there).  But selecting **Session** or **Visitor** you can make the visitor stick to the group they matched originally (using a cookie).
	 - Set the **Score** option to **50**
	 - Add a new criteria of type **Day of week** and tick the boxes for Monday to Friday.
	 - Add a second criteria of type **Time of day** and add a range of 0000 to 1200
	 - Save and publish

![Editing a group definition](/documentation/group-editing.png?raw=true "Editing a group definition")

![Editing a specific criteria](/documentation/definition-editing.png?raw=true "Editing a specific criteria")

 - Now go to "Settings" and find the document type for a piece of content you want to personalise.  For example with the Fanoe Starter Kit you could select the *Blog Post* document type
 - Add a new field of type **Personsalisation group picker** with an alias of **personalisationGroups**.
    - If you don't like this alias you can use a different one, see details on configuration below:
 - Back to "Content" again, find or create a page of this document type and pick the **Weekday morning visitors** personalisation group

 ![Picking groups](/documentation/picking-groups.png?raw=true "Picking groups")

 - Finally you need to amend your template to make use of the personalisation group via extension methods that will be available on instances of **IPublishedContent**, named **ShowToVisitor()** and/or **ScoreForVisitor()**, as described below.

## Templating

### Personalising repeated content - showing and hiding items in a list

A typical example would be to personalise a list of repeated content to only show items that are appropriate for the current site visitor.  Here's how you might do that:

```
    @using Umbraco.Cms.Core.Models.PublishedContent;
    @using Umbraco.Extensions;
    @using Our.Umbraco.PersonalisationGroups.Services;

    @inject IGroupMatchingService GroupMatchingService;

    @inherits Umbraco.Cms.Web.Common.Views.UmbracoViewPage
    @{
        Layout = null;
    }

    <h1>@Model.Value("headline")</h1>

    <ul>
        @foreach(var item in Model.Value<IEnumerable<IPublishedElement>>("nestedItems").Where(x => x.ShowToVisitor(GroupMatchingService)))
        {
            <li>@item.Value("title")</li>
        }
    </ul>
```

In this example, nested content items have been used, but the personalised items can be anything that implements `IPublishedContent` or `IPublishedElement` (e.g. from a content picker, or child nodes of the current one).

Note that for the version of the package running on Umbraco V9, we need to provide an instance of `IGroupMatchingService` to the `ShowToVisitor()` extension method.  This is different to previous versions where a static service was resolved within the method.  In order to get an instance of that, it can be resolved in the view, as you can see in the line beginning with `@inject...` above.

### Personalising page content

With a little more work you can also personalise an individual page.  One way to do this would be to create sub-nodes of a page of a new type called e.g. "Page Variation".  This document type should contain all the fields common to the parent page that you might want to personalise - e.g. title, body text, image - and an instance of the "Personalisation group picker".  You could then implement some logic on the parent page template to pull back the first of the sub-nodes that match the current site visitor.  If one is found, you can display the content from that sub-node rather than what's defined for the page.  And if not, display the default content for the page.  Something like:

```
	@{
		var personalisedContent = Model.Content.Children.Where(x => x.ShowToVisitor(GroupMatchingService)).FirstOrDefault();
		string title, bodyText;
		if (personalisedContent != null)
		{
			title = personalisedContent.Name;
			bodyText = personalisedContent.GetPropertyValue<string>("bodyText");
		}
		else
		{
			title = Model.Content.Name;
			bodyText = Model.Content.GetPropertyValue<string>("bodyText");
		}
	}

	<h1>@title</h1>
	<p>@bodyText</p>
```

### Personalising repeated content - ranking of items in a list

In addition to simply showing and hiding content, it's possible to rank a list of items to display them in order of relevence to the site visitor.  This can be achieved using the **Score** field for each created personsalisation group that can be set to a value between 1 and 100. These can either be set to all the same value, or more important groups can be given a higher score.

The following code will then determine which groups are associated with each item of content in the list, sum up the scores of those that match the site visitor and order with the highest score first:

```
    @{
        var personalisedContent = Model.Content.Children.OrderByDescending(x => x.ScoreForVisitor(GroupMatchingService));
    }
```

### Matching groups by name

If you want to simply check if the current user matches one or more groups by their name, there are some extensions on the `UmbracoHelper` to support this.  The following all return a boolean value:

```
    @Umbraco.MatchesGroup(GroupMatchingService, "Weekday Visitors")
    @Umbraco.MatchesAllGroups(GroupMatchingService, new string[] { "Weekday Visitors", "Country match" })
    @Umbraco.MatchesAnyGroup(GroupMatchingService, new string[] { "Weekday Visitors", "Country match" })
```

## Cookie regulations

Personalisation Groups requires the setting of cookies in the user's browser for certain functionality.  In particular the criteria for "pages viewed" and "number of visits" rely on the user's behaviour being tracked in a cookie value.

On many websites a user will be asked if they want to accept cookies and be provided the option to opt-out of unncessary ones.

In order to ensure that the package will cease writing tracking cookies, you can either set a cookie with a key of *personalisationGroupsCookiesDeclined* or a session variable with a key of *PersonalisationGroups_CookiesDeclined*.  If either of those are set, no further cookies will be written.  Any cookies already set won't be deleted (that's left to the developer to action if required when the visitor declines cookies), but they will no longer be updated or new ones created.

The keys for this cookie and session can be amended in configuration if required via configuration (see below).

## Configuration

No configuration is required if you are happy to accept the default behaviour of the package.

Optional keys and values can be added to your `appSettings.json` if required to amend this, within _Umbraco:PersonalisationGroups_, e.g.:

```
  "Umbraco": {
    "PersonalisationGroups": {
      "GroupPickerAlias": ""myCustomAlias"
    }
  }
```

The following configuration is available:

- `DisablePackage` - disables the filtering of content by personalisation groups, if this is set to true your content won't differ no matter what is configured in Umbraco.
- `GroupPickerAlias` - amends the alias that must be used when creating a property field of type personalisation group picker.
- `GeoLocationCountryDatabasePath` - amends the convention path for where the IP-country geolocation database can be found. See the "Country and region" section below for more details.
- `GeoLocationCityDatabasePath` - amends the convention path for where the IP-city geolocation database can be found. See the "Country and region" section below for more details.
- `GeoLocationRegionListPath` - if provided, the file referenced will be used to construct the list of regions for selection. See the "Country and region" section below for more details.
- `IncludeCriteria` - provides the specific list of criteria to make available for creating personalisation groups.
- `ExcludeCriteria` - provides a list of criteria to exclude from the full list of available criteria made available for creating personalisation groups.
- `NumberOfVisitsTrackingCookieExpiryInDays` - sets the expiry time for the cookie used for number of visits page tracking for the pages viewed criteria (default if not provided is 90).
- `ViewedPagesTrackingCookieExpiryInDays` - sets the expiry time for the cookie used for viewed page tracking for the pages viewed criteria (default if not provided is 90).
- `CookieKeyForTrackingNumberOfVisits` - defines the cookie key name used for tracking the number of visits.
- `CookieKeyForTrackingIfSessionAlreadyTracked` - defines the cookie key name used for tracking if the session has been recorded for the number of visits criteria, default is `personalisationGroupsNumberOfVisitsSessionStarted`.
- `CookieKeyForTrackingPagesViewed` - defines the cookie key name used for tracking pages viewed.
- `CookieKeyForSessionMatchedGroups` - defines the cookie key name used for tracking which session level groups the visitor has matched.
- `CookieKeyForPersistentMatchedGroups` - defines the cookie key name used for tracking which persistent (visitor) level groups the visitor has matched.
- `CookieKeyForTrackingCookiesDeclined` - defines the cookie key name used for tracking if a user has declined cookies.
- `SessionKeyForTrackingCookiesDeclined` - defines the session key name used for tracking if a user has declined cookies.
- `PersistentMatchedGroupsCookieExpiryInDays` - sets the expiry time for the cookie used for tracking which persistent (visitor) level groups the visitor has matched (default if not provided is 90).
- `TestFixedIp` - sets up an "spoof" IP address to use, in preference to the actual one used for browsing the site, for testing country and/or region matching using IP address.
- `CountryCodeProvider` - indicates which provider to use for country matching (the default is the MaxMind geo-location database, but a CDN header, e.g. that from [Cloudflare](https://support.cloudflare.com/hc/en-us/articles/200168236-What-does-Cloudflare-IP-Geolocation-do-) is available to be configured to use too.
- `CdnCountryCodeHttpHeaderName` - if a CDN header is used for country matching due to the above configuration setting, this key can be used to define which header is looked for.  If not provided, the default value of CF-IPCountry (as used by Cloudflare CDN) is used.
- `DisableHttpContextItemsUseInCookieOperations` - should anyone require it, setting this value to true will restore the previous behaviour for cookie handling amended in 1.0.5/2.1.6.
- `DisableUserActivityTracking` - if you aren't using criteria that require tracking of user activity into a cookie (e.g. "pages viewed", "number of visits"), you can set this to `true` to disable the tracking middleware. Cookies tracking visitor behaviour will not longer be created or updated.

## How it works

### Personalisation group criteria (IPersonalisationGroupCriteria)

Group criteria all implement an interface **IPersonalisationGroupCriteria** which provides a few properties to identify and describe the criteria as well as a single method - **MatchesVisitor()**.

Implementations of this interface must provide logic in this method for checking whether the current site visitor matches the definition provided using a JSON syntax supported by the criteria.  So for example the **DayOfWeekPersonalisationGroupCriteria** expects a simple JSON array of day numbers - e.g. [1, 3, 5] - which is compared with the current day to determine a match.

### Services

#### ICriteriaService

`ICriteriaService`, implemented by `CriteriaService` has one method `GetAvailableCriteria()` that will scan all loaded assemblies for implementations of the `IPersonalisationGroupCriteria` interface and store references to them.  It's in this way the package will support extensions through the development of other criteria that may not be in the core package itself.

It then makes these criteria available to application logic that needs to create group definitions based on them and to check if a given definition matches the related criteria.

#### IGroupMatchingService

`IGroupMatchingService`, implemented by `GroupMatchingService` was a static class in previous versions.  It's now a service registered with the IoC container an injectable into classes and views that need it.  It defines the logic for matching and scoring requests with groups.

#### IStickyMatchService

`IStickyMatchService`, implemented by `StickyMatchService` checks for and creates "sticky" matches that use cookies to identify a user in a personalisation group in a way that persists beyond the single page request.

### PersonalisationGroupDefinitionPropertyEditor

`PersonalisationGroupDefinitionPropertyEditor` defines an Umbraco property editor for the definition of the personalisation groups.  It has a related angular view and controller, and also ensures the angular assets required for the specific criteria that are provided with the core package are loaded and available for use.

### Front-end components

#### Umbraco 9 to 13: AngularJs views and controllers

The primary view and controller for the property editor are `editor.html` and `editor.controller.js` respectively.

In addition to these, each criteria has it's own view and controller that provide a user friendly means of configuring the definitions, named `definition.editor.html` and `definition.editor.controller.js` which are loaded via a call to the Umbraco dialogService.  All are provided as embedded resources.

Each criteria also has an angular service named `definition.translator.js` responsible for translating the JSON syntax into something more human readable.  So again for example the `DayOfWeekPersonalisationGroupCriteria` will render "Sunday, Tuesday, Thursday" from `[1, 3, 5]`.

#### Umbraco 14+: Web components

With the version created for Umbraco 14 the angularjs views and controllers have been moved into web components.

The editors for each criteria are implemented as Umbraco property editors.

The translators a provided as implementations of a custom manifest type introduced by the package, `ManifestPersonalisationGroupDefinitionDetailTranslator`.

### PublishedContentExtensions / PublishedElementExtensions

`PublishedElementExtensions` defines the extension methods on `IPublishedElement` (and it's derived interface `IPublishedContent`) named `ShowToVisitor(IGroupMatchingService groupMatchingService, bool showIfNoGroupsDefined = true)` and `ScoreForVisitor(IGroupMatchingService groupMatchingService, bool showIfNoGroupsDefined = true)`.  This implements the following logic:

- Checks for a group picker on the content.
    - If there's not one then we return the default value passed in the `showIfNoGroupsDefined` parameter (which if not provided, defaults to true, indicating to show to everyone).
- If found get the list of groups picked
    - If no groups are found then again we return the default value passed in the `showIfNoGroupsDefined` parameter.
- For each group picked, see if the definition provided matches the current site visitor.
    - If any one of them does, we return true (indicating to show the content)
	- If none of them do, we return false (indicating to hide the content)

There's also a related extension method on `UmbracoHelper` defined in `UmbracoHelperExtensions` and named `ShowToVisitor(IGroupMatchingService groupMatchingService, IEnumerable<int> groupIds, bool showIfNoGroupsDefined = true)`.  Using this you can pass through a list of group Ids that may be drawn from another location than the current node.

## Notes on particular criteria

### Country and region

The country criteria uses the [free GeoLite2 IP to country database](http://dev.maxmind.com/geoip/geoip2/geolite2/) made available by Maxmind.com.  It will look for it in `/umbraco/Data/PersonalisationGroups/GeoLite2-Country.mmdb` or at the path specified in configuration.

Similarly the region criteria uses the city database available from the same link above.  It will be read from the default location of `/umbraco/Data/PersonalisationGroups/GeoLite2-City.mmdb` or at the path specified in configuration.

When it comes to selecting regions to match against, the list of regions available is provided by the package from a [list provided by Maxmind](https://www.maxmind.com/download/geoip/misc/region_codes.csv). If you want to override this list, you can do so by taking a copy of this file, saving it to a relative path (likely in `/umbraco/Data/PersonalisationGroups/`) and referencing it in configuration.  Doing this for example would allow you to override the region names from local language to English (we've found that in some cases, matches are more likely having done this).

If you are using a CDN, it's possible to use a feature that provides the user's geographical country location in a header [such as that provided by Cloudflare](https://support.cloudflare.com/hc/en-us/articles/200168236-What-does-Cloudflare-IP-Geolocation-do-).  To use that method instead, apply the configuration described above.

By default the header `CF-IPCountry` is used.  If another is required it can be configured.

### Pages viewed

In order to support personalising content to site visitors that have seen or not seen particular pages we need to track which pages they have viewed.  This is implemented using a cookie named `personalisationGroupsPagesViewed` that will be written and amended on each page request.  It has a default expiry of 90 days but you can amend this in configuration.  The cookie expiry slides, so if the site is used again before it expires, the values stored remain.

If you don't want this cookie to be written, you can remove this criteria from the list available to select via configuration (see above).  If you do that, the criteria can't be used and the page tracking behaviour will be switched off.

## How to extend it

The idea moving forward is that not every criteria will necessarily be provided by the core package - it should be extensible by developers looking to implement something that might be quite specific to their application.  Due to the fact that the criteria that are made available come from a scan of all loaded assemblies, it should only be necessary to provide a dll with an implementation of `IPersonalisationGroupCriteria` and a unique `Alias` property, along with the appropriate front-end components.

For versions up to and include Umbraco 13, these are the definition editor angular view, controller and translation service - `definition.editor.html`, `definition.editor.controller.js` and `definition.definition.translator.js` respectively.

As with other Umbraco packages, you'll also need to create a `package.manifest` file listing out the additional JavaScript files you need, e.g.:

```
{
    javascript: [
        '~/App_Plugins/UmbracoPersonalisationGroups/GetResourceForCriteria/myAlias/definition.editor.controller.js',
        '~/App_Plugins/UmbracoPersonalisationGroups/GetResourceForCriteria/myAlias/definition.translator.js'
    ]
}
```

For Umbraco 14 and above you will need to register two components using the manifest system. One, a property editor, for the interface for editing your criteria. And second, an implementation of the TypeScript interface `PersonalisationGroupDefinitionDetailTranslatorApi`, registered via the custom manifest type `ManifestPersonalisationGroupDefinitionDetailTranslator.

As well as the `IPersonalisationGroupCriteria` interface, there's a helper base class `PersonalisationGroupCriteriaBase` that you can inherit from that provides some useful methods for matching values and regular expressions.  This isn't required though for the criteria to be recognised and used.

Prior to 3.1, when running Umbraco 13 or lower, the client-side files had to live in `App_Plugins/PersonalisationGroups/Criteria/<criteriaAlias>`, and the manifest file in `App_Plugins/PersonalisationGroups/`.  This [caused issues](https://github.com/AndyButland/UmbracoPersonalisationGroupsCore/issues/2) with custom criteria though, as they would be removed on each build.

To resolve that, `IPersonalisationGroupCriteria` has a property called `ClientAssetsFolder` that can be set to provide a custom location for the files.  For example, rather than `PersonalisationGroups/Criteria`, you can set it to `MyCustomFolder/Criteria`, and store your client-side asset files in `App_Plugins/MyCustomFolder/Criteria`.

The source code is the best place to look for details of the specific syntax and implementation you will need to provide for your custom criteria.

Examples for Umbraco 9 to 13 are found in the `support/3` branch.

And for Umbraco 14 in `develop`.

## Working with caching

Caching - at least at the page level - and personalisation don't really play nicely together.  Such caching will normally be varied by the URL but with personalisation we are displaying different content to different users, so we don't want the cached version of a page customised to particular user being displayed to the next.

There are a couple of helper methods available within the package to help with this though.

Firstly there's an extension method associated with the Umbraco helper called `GetPersonalisationGroupsHashForVisitor()` that calculates a hash for the current visitor based on all the personalisation groups that apply to them.  In other words, if you've created three groups, it will determine whether the user matches each of those three groups and create a string based on the result.  It takes three parameters:

- Either an Id or an instance of the root node for the created personalisation groups
- An identifer for the user (most likely to be the ASP.Net session Id)
- A number of seconds to cache the calculation for

The last parameter is quite important - although not expensive, you likely don't want to calculate this value on every page request.  However it equally shouldn't be cached for too long as visitor's status in each personalisation group may change as they use the website.  For example a group targetting morning visitors would no longer match if the same visitor is still there in the afternoon.

With that method in available, it's possible to use it with output caching to ensure the cache varies by this set of matched personalisation groups, for example with a controller like this:

```
    public class TestPageController : RenderMvcController
    {
        [OutputCache(Duration = 600, VaryByParam = "*", VaryByCustom = "PersonalisationGroupsVisitorHash")]
        public override IActionResult Index(RenderModel model)
        {
            ...
        }

    }
```

## Troubleshooting/known issues

### Output cache being invalidated

In testing I've discovered that installing the package with default options will cause any output cache to be invalidated on every page request.  Clearly personalisation with output caching is likely tricky anyway (as by defintion, the same cached page may need to be presented differently to different users), so unlikely to be something being used.  If you do have a need for it though, it's necessary to disable any criteria that set cookies on each page request.  It's this action that invalidates the cache.

To do this you can exclude such critieria by alias via configuration, the two provided by the core package being: `numberOfVisits` and `pagesViewed`.

If you needed to personalise by these criteria - number of pages viewed and/or number of visits - it would be necessary to implement an alternate criteria that uses a different storage mechanism (such as a custom table or hooked into an analytics engine).

## Management API (for Umbraco 14+)

Following patterns established for Umbraco CMS itself and other packages, the data needed in backoffice is provided by a management API.

This can be found at `/umbraco/swagger/index.html?urls.primaryName=Personalisation+Groups+Management+API`

## Package development (for Umbraco 14+)

To build and run (assuming a test site in the solution root):

```
cd TestWebapp.V14\
dotnet run
```

```
cd PersonalisationGroups\Client
npm i
npm run build
```

If management API changes are made, in order to generate updated typed front-end services and types:

```
npm run generate:api
```

## Version history

See [here](https://github.com/AndyButland/UmbracoPersonalisationGroups#version-history) for history of the package supporting Umbraco V7 and V8.

- 3.0.0-alpha1, 3.0.0-alpha2
    - Alpha releases for Umbraco V9 alpha.
- 3.0.0-beta1, 3.0.0-beta2, 3.0.0-beta3
    - Beta release for Umbraco V9 beta.
- 3.0.0
    - Full release compatabiliy with Umbraco V9.
- 3.1.0
    - Added the `ClientAssetsFolder` property to `IPersonalisationGroupCriteria`, allowing the provision of a folder for client assets used in custom criteria, avoiding issue with build removing them from the package's App_Plugins folder.
        - _Note that this is a breaking change for custom criteria due to the additional property.  It can be set to `PersonalisationGroups/Criteria` to retain the existing behaviour (and will have this value by default if inheriting from `PersonalisationGroupCriteriaBase`)._
- 3.2.0-rc001
- 3.2.0
    - Separated the package into two, for core and front-end (issue #4)
        - _Note that this contains breaking changes due to the changes of namespaces._
- 3.2.1
    - Fixed issue with wrong geolocation database reference. From [PR #5](https://github.com/AndyButland/UmbracoPersonalisationGroupsCore/pull/5).
- 3.2.2
    - Completed implementation of criteria based on Umbraco member information.
- 3.2.3
    - Removed use of depreciated methods that were removed in Umbraco 11, allowing support for the package on that version. From [PR #8](https://github.com/AndyButland/UmbracoPersonalisationGroupsCore/pull/8)
    - Hooked up the tracking of pages viewed and number of visits to cookies.
 - 3.2.4
    - Fixed default configuration of geolocation databases.
 - 3.2.5
    - Added fallback for client IP detection to use remote address on the connection if not found in a header.
- 3.2.6
    - Added icon and readme.
- 3.2.7
    - Extended maxmium Umbraco dependency to include Umbraco 12.
- 3.2.8
    - Added configuration option `DisableUserActivityTracking` to resolve issue [#10](https://github.com/AndyButland/UmbracoPersonalisationGroupsCore/issues/10)
- 3.2.9
    - Extended version range to support Umbraco 13.
- 3.2.10
    - Fixed cookie and session criteria such that checking for "does not match regex" with a missing cookie or session key returns true.
- 3.3.0
    - Surfaced the method `CountMatchingDefinitionDetails`, available in an earlier version of the package, via the `IGroupMatchingService` interface.
- 3.4.0
    - Used the secure option for all cookies.
- 4.0.0-rc1
    - Package updated to work with Umbraco 14.
- 4.0.0

> [!WARNING]
> The 4.0.0 release running on Umbraco 14 contains various breaking changes at the code level related to the backoffice update, the move to a single project using an RCL, and the migration of controllers into a management API.
> From a data perspective please note:
> - The "pages viewed" criteria now uses GUID keys rather than integer IDs.

- 5.0.0
    - Package updated to work with Umbraco 15.

- 6.0.0
    - Package updated to work with Umbraco 16.
- 6.1.0
    - Resolved issues running on Umbraco 16. Simplified client side dependencies and took minimum Umbraco dependency to 16.2.0.