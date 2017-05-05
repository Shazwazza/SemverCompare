using Newtonsoft.Json;
using Semver;

namespace SemverCompare.Controllers
{
    public class CompareResult
    {
        [JsonIgnore]
        public SemVersion Version { get; }
        public string Value { get; }
        public int Index { get; }
        public bool IsValid { get; }

        public CompareResult(SemVersion version, string value, int index)
        {
            Version = version;
            Value = value;
            Index = index;
            IsValid = version != null;
        }
    }
}