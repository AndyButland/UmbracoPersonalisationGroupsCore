namespace Our.Umbraco.PersonalisationGroups.Attributes
{
    using System;

    [AttributeUsage(AttributeTargets.Class)]
    public class CriteriaResourceAssemblyAttribute : Attribute
    {
        public string AssemblyName { get; set; }
    }
}
