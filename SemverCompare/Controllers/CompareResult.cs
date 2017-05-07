using Newtonsoft.Json;
using Semver;

namespace SemverCompare.Controllers
{
    public class CompareResult
    {
        [JsonIgnore]
        public SemVersion Version { get; }
        public string Value { get; }        
        public int OriginalIndex { get; }
        public bool IsValid { get; }
        public int ResultIndex { get; set; }

        public CompareResult(SemVersion version, string value, int originalIndex)
        {
            Version = version;
            Value = value;
            OriginalIndex = originalIndex;
            IsValid = version != null;
        }
    }
}