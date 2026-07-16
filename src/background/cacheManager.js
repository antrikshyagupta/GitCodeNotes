/**
 * Clean Cache Management System for GitCodeNotes Extension
 * Provides:
 * 1. Dropdown options cache 
 * 2. Temporary question storage with background sync
 * 3. Performance-focused, minimal API
 */

class CacheManager {
  constructor() {
    this.initialized = false;
    this.defaultDropdownOptions = {
      tags: [],
    };
  }

  async getCanonicalTags() {
    if (typeof window !== 'undefined' && window.tagMapper) {
      return Object.keys(window.tagMapper.getTagMap()).sort();
    }
    return [
      "array", "string", "hash", "dynamic-programming", "math", "sorting", 
      "greedy", "dfs", "bfs", "binary-search", "two-pointers", "graph", 
      "tree", "stack", "queue", "heap", "linked-list", "binary-tree", 
      "backtracking", "divide-and-conquer", "sliding-window", "prefix-sum",
      "bit-manipulation", "recursion", "memoization", "trie", "union-find",
      "shortest-path", "topological-sort", "game-theory", "number-theory",
      "combinatorics", "geometry", "implementation"
    ].sort();
  }

  async initialize() {
    if (this.initialized) return;

    try {
      const canonicalTags = await this.getCanonicalTags();
      this.defaultDropdownOptions.tags = canonicalTags;

      const { dropdownOptions } = await chrome.storage.local.get(["dropdownOptions"]);
      
      if (!dropdownOptions) {
        await chrome.storage.local.set({
          dropdownOptions: this.defaultDropdownOptions,
        });
      } else {
        const mergedTags = [...new Set([...canonicalTags, ...(dropdownOptions.tags || [])])].sort();
        await chrome.storage.local.set({
          dropdownOptions: { tags: mergedTags },
        });
      }

      this.initialized = true;
    } catch (error) {
      this.initialized = true; 
    }
  }

  async getDropdownOptions() {
    await this.initialize();

    try {
      const { dropdownOptions } = await chrome.storage.local.get(["dropdownOptions"]);
      return dropdownOptions || this.defaultDropdownOptions;
    } catch (error) {
      return this.defaultDropdownOptions;
    }
  }

  async addDropdownOption(type, value) {
    if (type !== 'tags') return false;
    await this.initialize();

    try {
      const currentOptions = await this.getDropdownOptions();
      if (!currentOptions.tags) currentOptions.tags = [];

      if (!currentOptions.tags.includes(value)) {
        currentOptions.tags.push(value);
        currentOptions.tags.sort();
        await chrome.storage.local.set({ dropdownOptions: currentOptions });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}

export const cacheManager = new CacheManager();
cacheManager.initialize().catch(() => {});
