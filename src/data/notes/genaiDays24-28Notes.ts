export const genAIDays24to28Notes = {
  id: "generative-ai-days-24-28-llm-architecture",
  day: 24,
  dayStart: 24,
  dayEnd: 28,
  dayRange: "Days 24–28",
  title: "LLM Architecture",
  track: "AI / ML",
  section: "Generative AI",
  contentFile: "genaiDays24-28Content.md",
  status: "not-started",
  overview: "Transformer, tokens, embeddings, self-attention, context window, encoder/decoder overview.",
  resources: [
    { title: "HF LLM Course", url: "https://huggingface.co/learn/llm-course/chapter1/1", type: "course" },
    { title: "MS GenAI Beginners", url: "https://github.com/microsoft/generative-ai-for-beginners", type: "course" },
    { title: "The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/", type: "article" },
    { title: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762", type: "paper" }
  ],
  flowchart: [
    { id: "1-overview", title: "Overview", sectionId: "1-overview" },
    { id: "2-what-is-a-language-model", title: "What Is a Language Model?", sectionId: "2-what-is-a-language-model" },
    { id: "3-tokens-and-tokenization", title: "Tokens and Tokenization", sectionId: "3-tokens-and-tokenization" },
    { id: "4-embeddings", title: "Embeddings", sectionId: "4-embeddings" },
    { id: "5-transformer-input-pipeline", title: "Transformer Input Pipeline", sectionId: "5-transformer-input-pipeline" },
    { id: "6-self-attention-query-key-value", title: "Self-Attention: Query, Key, Value", sectionId: "6-self-attention-query-key-value" },
    { id: "7-scaled-dot-product-attention", title: "Scaled Dot-Product Attention", sectionId: "7-scaled-dot-product-attention" },
    { id: "8-attention-masks", title: "Attention Masks", sectionId: "8-attention-masks" },
    { id: "9-multi-head-attention-and-transformer-blocks", title: "Multi-Head Attention and Transformer Blocks", sectionId: "9-multi-head-attention-and-transformer-blocks" },
    { id: "10-positional-information", title: "Positional Information", sectionId: "10-positional-information" },
    { id: "11-context-window", title: "Context Window", sectionId: "11-context-window" },
    { id: "12-encoder-decoder-and-encoderdecoder-models", title: "Encoder, Decoder, and Encoder–Decoder Models", sectionId: "12-encoder-decoder-and-encoderdecoder-models" },
    { id: "13-common-mistakes", title: "Common Mistakes", sectionId: "13-common-mistakes" },
    { id: "14-placement-and-interview-questions", title: "Placement and Interview Questions", sectionId: "14-placement-and-interview-questions" },
    { id: "15-practice", title: "Practice", sectionId: "15-practice" },
    { id: "16-quick-revision", title: "Quick Revision", sectionId: "16-quick-revision" },
    { id: "17-final-checklist", title: "Final Checklist", sectionId: "17-final-checklist" },
    { id: "18-recommended-resources", title: "Recommended Resources", sectionId: "18-recommended-resources" }
  ]
};
