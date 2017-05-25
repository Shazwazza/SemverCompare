using System;
using System.Collections;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Semver;

namespace SemverCompare.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index(string[] version = null)
        {
            return View(version);
        }

        public IEnumerable<CompareResult> CompareVersions(string[] version)
        {
            var result = new List<CompareResult>();
            for (var index = 0; index < version.Length; index++)
            {
                var v = version[index];

                ////split on '+' since the Semver lib doesn't recognize this currently
                //var parts = version.Split(new[] {'+'}, StringSplitOptions.RemoveEmptyEntries);

                result.Add(SemVersion.TryParse(v, out SemVersion parsed)
                    ? new CompareResult(parsed, v, index)
                    : new CompareResult(null, v, index));
            }

            //sort the result
            result.Sort((r1, r2) =>
            {
                if (r1.Version == null && r2.Version == null) return 0;
                if (r1.Version == null) return -1;
                if (r2.Version == null) return 1;
                return r1.Version.CompareByPrecedence(r2.Version);                
            });

            var resultIndex = -1;
            SemVersion previousResult = null;
            foreach (var compareResult in result)
            {
                if (compareResult.Version != null)
                {                    
                    if (!compareResult.Version.PrecedenceMatches(previousResult))
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
