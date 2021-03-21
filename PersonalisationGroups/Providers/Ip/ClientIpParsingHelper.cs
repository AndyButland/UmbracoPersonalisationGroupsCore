using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;

namespace Our.Umbraco.PersonalisationGroups.Providers.Ip
{    
    public class ClientIpParser
    {
        private static readonly IEnumerable<string> HeaderKeys = new[]
            {
                "CF-Connecting-IP", "HTTP_X_FORWARDED_FOR", "REMOTE_ADDR",
                "HTTP_CLIENT_IP", "HTTP_X_FORWARDED", "HTTP_X_CLUSTER_CLIENT_IP",
                "HTTP_FORWARDED_FOR", "HTTP_FORWARDED"
            };

        public string ParseClientIp(IHeaderDictionary requestHeaders)
        {
            foreach (var key in HeaderKeys)
            {
                if (TryParseIpFromServerVariable(requestHeaders, key, out string ip))
                {
                    return ip;
                }
            }

            return string.Empty;
        }

        private bool TryParseIpFromServerVariable(IHeaderDictionary requestHeaders, string key, out string ip)
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

            // We might not have a single IP here, so we should check for multiple strings in our StringValues value.
            // The originating value (the client IP) is the first one.
            ip = RemovePortNumberFromIp(value.First());

            // Finally, ensure we have a valid IP.
            return IsValidIp(ip);
        }

        private string RemovePortNumberFromIp(string ip)
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
