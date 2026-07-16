export default class MultiSelectDropdown {
  constructor(id, opts = {}) {
    Object.assign(this, { 
      c: document.getElementById(id), 
      items: opts.items || [], 
      sel: new Set(), 
      open: false, 
      multi: opts.multiSelect !== false 
    }, opts);

    this.c.innerHTML = `
      <div class="msd-input-area ${this.multi ? '' : 'single-select'}">
        <div class="msd-placeholder">${this.placeholder || 'Select...'}</div>
        <div class="msd-tags"></div>
        <input type="text" class="msd-input">
        <div class="msd-arrow">▼</div>
      </div>
      <div class="msd-dropdown" style="max-height:${this.maxHeight || '200px'}"></div>
    `;

    [this.area, this.drop] = this.c.children;
    [this.ph, this.tags, this.inp, this.arr] = this.area.children;
    
    this.focusedIdx = -1;
    
    this.area.onclick = () => this.inp.focus();
    
    this.arr.onclick = (e) => { 
      e.stopPropagation(); 
      this.toggle(); 
    };
    
    this.inp.oninput = () => { 
      this.render(); 
      this.upd(); 
    };
    
    this.inp.onkeydown = e => {
      const opts = Array.from(this.drop.querySelectorAll('.msd-option[data-v]'));
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.focusedIdx = Math.min(this.focusedIdx + 1, opts.length - 1);
        this.updateFocus(opts);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.focusedIdx = Math.max(this.focusedIdx - 1, -1);
        this.updateFocus(opts);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.focusedIdx >= 0 && opts[this.focusedIdx]) {
           this.selItem(opts[this.focusedIdx].dataset.v);
        } else {
           this.add(this.inp.value);
        }
      } else if (e.key === 'Backspace' && !this.inp.value) {
        this.rem([...this.sel].pop());
      } else if (e.key === 'Escape') {
        this.close();
      }
    };
    
    this.inp.onfocus = () => { 
      this.open = true; 
      this.drop.classList.add('open'); 
      this.arr.classList.add('open'); 
      this.render(); 
      this.upd(); 
    };
    
    document.addEventListener('click', e => { 
      if (!this.c.contains(e.target)) {
        this.close();
      }
    });
    
    this.render(); 
    this.upd();
  }

  toggle() { 
    if (this.open) {
      this.close();
    } else {
      this.inp.focus();
    }
  }

  close() { 
    this.open = false; 
    this.drop.classList.remove('open'); 
    this.arr.classList.remove('open'); 
    this.inp.value = ''; 
    this.upd(); 
  }

  updateFocus(opts) {
    opts.forEach((el, i) => {
      if (i === this.focusedIdx) {
        el.style.backgroundColor = '#e8f4fd';
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.style.backgroundColor = '';
      }
    });
  }

  render() {
    this.focusedIdx = -1;
    let q = this.inp.value.trim();
    let norm = typeof tagMapper !== 'undefined' && tagMapper.normalizeTag ? tagMapper.normalizeTag(q) : q;
    
    let items = this.items
      .filter(i => i.toLowerCase().includes(q.toLowerCase()) && !this.sel.has(i))
      .sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        const aStarts = aLower.startsWith(q.toLowerCase());
        const bStarts = bLower.startsWith(q.toLowerCase());
        
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        return aLower.localeCompare(bLower);
      });
      
    let h = items.map(i => `<div class="msd-option" data-v="${i}">${i}</div>`).join('');
    
    if (norm !== q && q && !this.sel.has(norm)) {
      h += `<div class="msd-option" data-v="${norm}" style="color:#0c5460;background:#e8f4fd;font-weight:500;">${norm}</div>`;
    }
    
    if (this.allowCustom !== false && q && !this.items.includes(q) && !this.sel.has(q) && norm === q) {
      h += `<div class="msd-option add-new" data-v="${norm}">Add "${q}"</div>`;
    }
    
    this.drop.innerHTML = h || `<div class="msd-option" style="color:#6c757d;font-style:italic">${q ? 'No matching options' : 'No options available'}</div>`;
    
    this.drop.querySelectorAll('.msd-option[data-v]').forEach(el => {
      el.onclick = () => this.selItem(el.dataset.v);
    });
  }

  add(q) {
    if (!q) return;
    
    q.split(',').map(i => i.trim()).filter(Boolean).forEach(i => {
      let norm = typeof tagMapper !== 'undefined' && tagMapper.normalizeTag ? tagMapper.normalizeTag(i) : i;
      
      if (!this.items.includes(norm) && this.allowCustom !== false) {
        this.items.push(norm);
      }
      
      this.selItem(norm);
    });
  }

  selItem(i) {
    if (!this.sel.has(i)) {
      if (!this.multi) {
        this.sel.clear();
      }
      
      this.sel.add(i); 
      this.inp.value = ''; 
      this.updTags(); 
      this.render(); 
      this.c.dispatchEvent(new CustomEvent('change'));
      
      if (!this.multi) {
        this.close();
      }
    }
  }

  rem(i) { 
    if (i) { 
      this.sel.delete(i); 
      this.updTags(); 
      this.render(); 
      this.c.dispatchEvent(new CustomEvent('change')); 
    } 
  }

  updTags() {
    this.tags.innerHTML = [...this.sel].map(v => `
      <div class="msd-tag">
        <span>${v}</span>
        <span class="msd-tag-remove" data-v="${v}">
          <img src="img/remove.png" style="width:12px;height:12px;cursor:pointer">
        </span>
      </div>
    `).join('');
    
    this.tags.querySelectorAll('.msd-tag-remove').forEach(el => {
      el.onclick = e => { 
        e.stopPropagation(); 
        this.rem(el.dataset.v); 
      };
    });
    
    this.upd();
  }

  upd() { 
    this.area.classList.toggle('has-content', this.sel.size > 0 || this.inp.value.trim()); 
  }

  getValues() { 
    return [...this.sel]; 
  }

  setValues(v) { 
    this.sel = new Set(v); 
    this.updTags(); 
    if (this.open) {
      this.render(); 
    }
    this.upd(); 
  }
}

if (typeof window !== "undefined") {
  window.MultiSelectDropdown = MultiSelectDropdown;
}
