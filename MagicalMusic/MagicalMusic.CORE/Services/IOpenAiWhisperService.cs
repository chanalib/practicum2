﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.Services
{
    public interface IOpenAiWhisperService
    {
        Task<string> TranscribeAsync(string filePath, string language);
    }
}
