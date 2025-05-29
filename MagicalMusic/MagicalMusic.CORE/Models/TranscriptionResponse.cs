using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.Models
{
    public class TranscriptionResponse
    {
        [JsonPropertyName("text")]
        public string Text { get; set; }
    }

}
