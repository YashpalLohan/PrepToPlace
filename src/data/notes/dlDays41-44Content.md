# Days 41–44 — NLP Fundamentals

## 1. Overview

Natural Language Processing (NLP) converts human language into representations that algorithms can process.

This block covers:
- Text normalisation and tokenization
- Bag of Words (BoW)
- TF-IDF
- Word embeddings
- CBOW and Skip-gram Word2Vec
- GloVe
- Static vs contextual embeddings
- Practical embedding applications

## 2. NLP Pipeline

A simple classical NLP pipeline:

```text
Raw text
   |
Normalisation / cleaning
   |
Tokenization
   |
Vocabulary construction
   |
Vector representation
   |
ML model
   |
Prediction / retrieval / classification
```

Modern pretrained language models often use subword tokenization and learned token embeddings, but the conceptual pipeline remains useful.

## 3. Text Preprocessing

Common steps:
- Lowercasing where case is not meaningful.
- Unicode normalisation.
- Removing or standardising punctuation depending on the task.
- Handling URLs, mentions, and special symbols.
- Sentence segmentation.
- Tokenization.
- Optional stop-word filtering or stemming/lemmatisation in classical pipelines.

Do not blindly remove stop words, punctuation, or casing. They can carry meaning (for example, negation, product codes, named entities, or programming syntax).

## 4. Tokenization

Tokenization splits text into units.

Common levels:
- Word tokenization.
- Character tokenization.
- Subword tokenization (BPE, WordPiece, Unigram).

### Why subwords?

Word-level vocabularies struggle with:
- Rare words.
- Misspellings.
- New names.
- Morphological variants.
- Vocabulary growth.

Subword tokenization can represent an unfamiliar word as a sequence of known pieces.

### Special tokens

Language models may use:
- Beginning/end of sequence tokens.
- Padding tokens.
- Unknown tokens.
- Classification or separator tokens.
- Instruction/chat markers.

Exact token conventions vary by tokenizer/model.

## 5. Bag of Words (BoW)

BoW represents a document by counts of vocabulary terms, ignoring word order.

Example corpus:
- "deep learning is useful"
- "learning models use data"

Vocabulary: `[deep, learning, is, useful, models, use, data]`

A document becomes a count vector over these terms.

### Strengths
- Simple, interpretable baseline.
- Effective for some text classification tasks.
- Works with classical linear models.

### Limitations
- Discards word order.
- Does not directly model semantic similarity.
- Sparse, high-dimensional vectors.
- Vocabulary choices matter.

## 6. TF-IDF

TF-IDF gives more weight to terms that are frequent in a document but relatively rare across the corpus.

Term frequency (TF) measures within-document frequency. Inverse document frequency (IDF) reduces weight for terms appearing in many documents.

A common smoothed IDF variant:

\[
IDF(t)=\log\left(\frac{1+N}{1+df(t)}\right)+1
\]

where:
- \(N\): number of documents.
- \(df(t)\): number of documents containing term t.

Then:

\[
TFIDF(t,d)=TF(t,d)\cdot IDF(t)
\]

Exact term-frequency and IDF conventions vary by implementation.

### Intuition
- A term used frequently in one document can be informative.
- A term used in nearly every document is less discriminative.
- IDF reduces the influence of corpus-wide common terms.

## 7. BoW vs TF-IDF

| Property | Bag of Words | TF-IDF |
|---|---|---|
| Representation | Raw term counts or binary presence | Frequency weighted by corpus rarity |
| Word order | Ignored | Ignored |
| Semantic understanding | Limited | Limited |
| Interpretability | High | High |
| Common words | Can dominate counts | Downweighted by IDF |

Both are sparse lexical representations, not dense semantic embeddings.

## 8. Word Embeddings

A word embedding maps a token to a dense, low-dimensional vector.

The idea is that words used in similar contexts can acquire similar representations.

Applications:
- Semantic similarity.
- Document classification.
- Search and retrieval.
- Recommendation.
- Entity or relation features.
- Initial representations for neural NLP models.

### Distributional intuition

"Words that occur in similar contexts tend to have related meanings."

Embeddings encode statistical patterns from their training corpus. They can also reflect corpus biases and do not guarantee human-like understanding.

## 9. Word2Vec

Word2Vec learns dense word vectors using a prediction task.

Two classic objectives:

### CBOW — Continuous Bag of Words

Predict the center/target word from surrounding context words.

```text
Context words → combine embeddings → predict target word
```

### Skip-gram

Predict surrounding context words from a center word.

```text
Center word → embedding → predict nearby context words
```

CBOW is often described as faster and smoother for frequent words; Skip-gram can represent rare words effectively in some settings. Actual behaviour depends on data and training choices.

## 10. Negative Sampling

Predicting a word over a huge vocabulary can be expensive.

Negative sampling trains the model to:
- Assign high compatibility to observed target-context pairs.
- Assign low compatibility to sampled negative pairs.

For center embedding \(v_w\) and context embedding \(u_c\), a common objective maximises:

\[
\log\sigma(u_c^Tv_w)+\sum_{j=1}^{k}\log\sigma(-u_{n_j}^Tv_w)
\]

where \(n_j\) are sampled negative words.

It is a computationally practical approximation/objective used in Word2Vec training, not the same thing as a full-vocabulary softmax.

## 11. GloVe

GloVe stands for Global Vectors for Word Representation.

It learns word vectors using aggregated global word–word co-occurrence statistics.

High-level:
1. Build a word co-occurrence matrix.
2. Measure how often words appear near each other.
3. Learn vectors that fit a weighted relationship to co-occurrence counts.
4. Use learned vectors as word representations.

Word2Vec focuses on local prediction contexts; GloVe uses global co-occurrence statistics in its objective. Both learn static word vectors.

## 12. Static vs Contextual Embeddings

### Static embeddings
A token has one learned vector regardless of sentence context.

Examples:
- Word2Vec.
- GloVe.
- FastText (with subword information).

The word "bank" receives the same vector in "river bank" and "bank account".

### Contextual embeddings
A token representation changes based on surrounding words.

Examples:
- BERT hidden states.
- Transformer language-model hidden states.

The representation of "bank" can differ between financial and river contexts.

## 13. Embedding Similarity

Cosine similarity measures the angle between two non-zero vectors:

\[
cosine(u,v)=\frac{u^Tv}{\|u\|_2\|v\|_2}
\]

Values closer to 1 indicate a smaller angle / stronger directional similarity.

Cosine similarity is common for semantic search and nearest-neighbour retrieval. Similarity quality depends on the embedding model and domain.

## 14. Practical Text Vectorisation with scikit-learn

```python
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

documents = [
    "deep learning models learn representations",
    "machine learning uses data",
    "deep models can learn useful features"
]

count_vectorizer = CountVectorizer()
X_bow = count_vectorizer.fit_transform(documents)

tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
X_tfidf = tfidf_vectorizer.fit_transform(documents)

print(count_vectorizer.get_feature_names_out())
print(X_bow.shape, X_tfidf.shape)
```

For a supervised project, fit vectorizers on training text only and transform validation/test text with the fitted vectorizer.

## 15. Applications and Limitations

### Applications
- Text classification.
- Search and semantic retrieval.
- Recommendation.
- Clustering documents.
- Similarity and duplicate detection.
- Feature inputs for downstream neural networks.

### Limitations
- Static embeddings do not adapt to context.
- Word-level representations struggle with unseen words.
- Vocabulary and corpus domain matter.
- Similarity can encode unwanted social or historical biases.
- Averages of word embeddings can lose compositional meaning.

## 16. Common Mistakes

- Assuming BoW or TF-IDF captures word order.
- Treating TF-IDF as a contextual semantic embedding.
- Confusing CBOW and Skip-gram prediction directions.
- Assuming static embeddings change with sentence context.
- Fitting a vectorizer on the full dataset before splitting.
- Assuming cosine similarity means two texts are equivalent.
- Ignoring tokenisation and vocabulary mismatch.
- Treating embeddings as bias-free representations.

## 17. Placement and Interview Questions

**Q1. What is tokenization?**  
Splitting text into units such as words, characters, or subword tokens.

**Q2. What is BoW?**  
A sparse document representation based on vocabulary counts or presence, ignoring word order.

**Q3. Why use TF-IDF?**  
It downweights terms common across many documents and highlights terms more characteristic of individual documents.

**Q4. CBOW vs Skip-gram?**  
CBOW predicts a target word from context; Skip-gram predicts context words from a target word.

**Q5. What is a word embedding?**  
A dense vector representation learned from usage patterns.

**Q6. Word2Vec vs GloVe?**  
Word2Vec uses local predictive objectives; GloVe uses global word co-occurrence statistics.

**Q7. Static vs contextual embeddings?**  
Static vectors are fixed per token; contextual representations depend on surrounding text.

**Q8. Why use cosine similarity?**  
It compares vector orientation and is commonly used to retrieve semantically similar embeddings.

## 18. Practice

### Paper exercises
1. Build a tiny vocabulary from three sample sentences and construct BoW vectors.
2. Explain why a word appearing in every document receives lower IDF.
3. Draw CBOW and Skip-gram prediction diagrams.
4. Explain how the embedding for "bank" differs between static and contextual models.

### Coding exercise
Create a small text-classification baseline:
- Split documents into train/validation/test.
- Compare CountVectorizer and TfidfVectorizer.
- Train Logistic Regression.
- Evaluate macro-F1 and confusion matrix.
- Inspect important terms.
- Explain what word order and context information the representation loses.

## 19. Quick Revision

- Tokenization: text to tokens.
- BoW: sparse counts/presence.
- TF-IDF: term relevance weighted by document rarity.
- Embedding: dense token vector.
- CBOW: context predicts target.
- Skip-gram: target predicts context.
- Negative sampling: observed vs sampled negative pairs.
- GloVe: global co-occurrence statistics.
- Static embedding: one vector per token.
- Contextual embedding: depends on sentence context.
- Cosine similarity: angular similarity.

## 20. Final Checklist

- [ ] Explain word and subword tokenization.
- [ ] Build a BoW representation.
- [ ] Calculate and interpret TF-IDF.
- [ ] Draw CBOW and Skip-gram.
- [ ] Explain negative sampling.
- [ ] Compare Word2Vec and GloVe.
- [ ] Distinguish static and contextual embeddings.
- [ ] Use embeddings and cosine similarity appropriately.
- [ ] Build a leakage-safe TF-IDF classification baseline.

## 21. Recommended Resources

- [Jay Alammar — The Illustrated Word2Vec](https://jalammar.github.io/illustrated-word2vec/)
- [Stanford CME295 syllabus — NLP, embeddings, Word2Vec](https://cme295.stanford.edu/syllabus/)
- [DeepLearning.AI courses](https://www.deeplearning.ai/courses/)
- [Stanford GloVe project](https://nlp.stanford.edu/projects/glove/)
- [scikit-learn — Text Feature Extraction](https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction)
