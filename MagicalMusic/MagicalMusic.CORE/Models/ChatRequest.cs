using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.Models
{
    public class ChatRequest
    {
        public string Model { get; set; }
        public List<Prompt> Prompts { get; set; }
        public double Temperature { get; set; } = 0.7;
        public int MaxTokens { get; set; } = 1000;
    }
    public class Prompt
    {
        public string Content { get; set; }

    }

}
