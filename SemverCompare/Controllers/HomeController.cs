using System.Collections;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Semver;

namespace SemverCompare.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IEnumerable<CompareResult> CompareVersions(string[] versions)
        {
            var result = new List<CompareResult>();
            for (var index = 0; index < versions.Length; index++)
            {
                var version = versions[index];
                result.Add(SemVersion.TryParse(version, out SemVersion parsed)
                    ? new CompareResult(parsed, version, index)
                    : new CompareResult(null, version, index));
            }

            //sort the result
            result.Sort((r1, r2) =>
            {
                if (r1.Version == null && r2.Version == null) return 0;
                if (r1.Version == null) return -1;
                if (r2.Version == null) return 1;
                return r1.Version.CompareTo(r2.Version);                
            });

            var resultIndex = -1;
            SemVersion previousResult = null;
            foreach (var compareResult in result)
            {
                if (compareResult.Version != null)
                {                    
                    if (previousResult != compareResult.Version)
                    {                        
                        resultIndex++;
                        previousResult = compareResult.Version;
                    }
                    compareResult.ResultIndex = resultIndex;
                }
            }

            return result;
        }
    }
}
