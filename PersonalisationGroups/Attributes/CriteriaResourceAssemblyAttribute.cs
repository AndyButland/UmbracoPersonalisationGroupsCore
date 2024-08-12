namespace Our.Umbraco.PersonalisationGroups.Attributes;

using System;

[AttributeUsage(AttributeTargets.Class)]
public class CriteriaResourceAssemblyAttribute : Attribute
{
    public required string AssemblyName { get; set; }
}
