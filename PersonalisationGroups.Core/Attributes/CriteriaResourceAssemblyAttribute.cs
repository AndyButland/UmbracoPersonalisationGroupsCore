namespace Our.Umbraco.PersonalisationGroups.Core.Attributes
{
    using System;

    [AttributeUsage(AttributeTargets.Class)]
    public class CriteriaResourceAssemblyAttribute : Attribute
    {
        public string AssemblyName { get; set; }
    }
}
