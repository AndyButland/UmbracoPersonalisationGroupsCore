﻿using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace Our.Umbraco.PersonalisationGroups.Core.Providers.Ip
{
    public class ClientIpParser
    {
        private static readonly IEnumerable<string> HeaderKeys = new[]
            {
                "CF-Connecting-IP", "HTTP_X_FORWARDED_FOR", "REMOTE_ADDR",
                "HTTP_CLIENT_IP", "HTTP_X_FORWARDED", "HTTP_X_CLUSTER_CLIENT_IP",
                "HTTP_FORWARDED_FOR", "HTTP_FORWARDED"
            };

        public string ParseClientIp(HttpContext httpContext)
        {
            if (httpContext == null)
            {
                return string.Empty;
            }

            foreach (var key in HeaderKeys)
            {
                if (TryParseIpFromHeaders(httpContext.Request.Headers, key, out string ip))
                {
                    return ip;
                }
            }

            return httpContext.Connection.RemoteIpAddress.ToString();
        }

        private bool TryParseIpFromHeaders(IHeaderDictionary requestHeaders, string key, out string ip)
        {
            var value = requestHeaders[key];
            if (value == StringValues.Empty)
            {
                ip = string.Empty;
                return false;
            }

            // We don't want local ips
            if (value.ToString().StartsWith("192."))
            {
                ip = string.Empty;
                return false;
            }

            // We might not have a single IP here, as it's possible if the request has passed through multiple proxies, there will be 
            // additional ones in the header
            // If so, the original requesting IP is the first one in a comma+space delimited list
            value = value.ToString().Split(new[] { ", " }, StringSplitOptions.None).First();
            ip = RemovePortNumberFromIp(value);

            // Finally, ensure we have a valid IP.
            return IsValidIp(ip);
        }

        private static string RemovePortNumberFromIp(string ip)
        {
            if (ip.Contains(":"))
            {
                ip = ip.Substring(0, ip.IndexOf(":", StringComparison.Ordinal));
            }

            return ip;
        }

        private bool IsValidIp(string ip) => !string.IsNullOrEmpty(ip) && IPAddress.TryParse(ip, out _);
    }
}
