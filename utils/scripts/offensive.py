import re
from typing import Set, List, Tuple
import unicodedata

class ContentModerator:
    def __init__(self):
        self.offensive_words: Set[str] = set()
        self.word_pattern = re.compile(r'\b\w+\b')
        
    def normalize_text(self, text: str) -> str:
        """Normalize text by removing accents and converting to lowercase."""
        text = text.lower()
        text = unicodedata.normalize('NFKD', text)
        text = ''.join(c for c in text if not unicodedata.combining(c))
        return text
    
    def load_words(self, filepath: str) -> None:
        """Load offensive words from a file, one word/phrase per line."""
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                words = [line.strip().lower() for line in file if line.strip()]
                self.offensive_words.update(words)
        except FileNotFoundError:
            raise FileNotFoundError(f"Could not find word list file: {filepath}")
    
    def check_text(self, text: str) -> Tuple[bool, List[str], str]:
        """
        Check text for offensive content and return:
        - Whether text is offensive
        - List of found offensive terms
        - Censored version of the text
        """
        if not text:
            return False, [], text
        
        original_text = text
        text = self.normalize_text(text)
        found_terms = []
        censored_text = original_text
        
        # Check for exact matches of multi-word phrases first
        for term in sorted(self.offensive_words, key=len, reverse=True):
            if ' ' in term and term in text:
                found_terms.append(term)
                # Censor the term in the output text
                pattern = re.compile(re.escape(term), re.IGNORECASE)
                censored_text = pattern.sub('*' * len(term), censored_text)
        
        # Check for single word matches
        words = self.word_pattern.findall(text)
        for word in words:
            if word in self.offensive_words:
                found_terms.append(word)
                # Censor the word in the output text
                pattern = re.compile(r'\b' + re.escape(word) + r'\b', re.IGNORECASE)
                censored_text = pattern.sub('*' * len(word), censored_text)
        
        return bool(found_terms), found_terms, censored_text

def main():
    moderator = ContentModerator()
    
    # Example usage
    try:
        moderator.load_words('offensive_words.txt')
        
        while True:
            text = input("\nEnter text to check (or 'quit' to exit): ")
            if text.lower() == 'quit':
                break
                
            is_offensive, found_terms, censored_text = moderator.check_text(text)
            
            print("\nResults:")
            print(f"Original text: {text}")
            print(f"Offensive content detected: {is_offensive}")
            if found_terms:
                print(f"Found offensive terms: {', '.join(found_terms)}")
            print(f"Censored text: {censored_text}")
            
    except FileNotFoundError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()