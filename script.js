// script.js - chức năng nhỏ: hiển thị thời gian và toggle theme
(function(){
  // Hiển thị thời gian
  const tEl = document.getElementById('time');
  if(tEl){
    const now = new Date();
    tEl.textContent = 'Bây giờ: ' + now.toLocaleString();
  }

  // Tìm kiếm + lọc client-side
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  const postsGrid = document.getElementById('posts-grid');
  function getPostElements(){ return postsGrid ? Array.from(postsGrid.querySelectorAll('.post')) : []; }
  const noResults = document.getElementById('no-results');
  const catLinks = document.querySelectorAll('.cats a');
  let activeCat = 'all';

  function normalize(s){
    return (s || '').toString().toLowerCase();
  }

  function filterPosts(){
    const q = normalize(input ? input.value : '');
    let shown = 0;
    const posts = getPostElements();
    posts.forEach(p => {
      const title = normalize(p.getAttribute('data-title'));
      const desc = normalize(p.querySelector('.post-excerpt')?.textContent);
      const loc = normalize(p.getAttribute('data-loc'));
      const cat = p.getAttribute('data-cat') || 'all';

      const matchCat = (activeCat === 'all') || (cat === activeCat);
      const matchQuery = q === '' || title.includes(q) || desc.includes(q) || loc.includes(q);

      if(matchCat && matchQuery){
        p.style.display = '';
        shown++;
      } else {
        p.style.display = 'none';
      }
    });

    if(noResults) noResults.style.display = shown === 0 ? '' : 'none';
  }

  if(input){
    input.addEventListener('input', filterPosts);
  }
  if(clearBtn && input){
    clearBtn.addEventListener('click', function(){ input.value = ''; input.focus(); filterPosts(); });
  }

  catLinks.forEach(a => {
    a.addEventListener('click', function(e){
      e.preventDefault();
      catLinks.forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      activeCat = this.getAttribute('data-cat') || 'all';
      filterPosts();
    });
  });

  // Shortcut nhấn 't' để chuyển giao diện tối/sáng (demo)
  let dark = false;
  document.addEventListener('keydown', function(e){
    if(e.key === 't' || e.key === 'T'){
      dark = !dark;
      if(dark){
        document.documentElement.style.setProperty('--bg','#0f1720');
        document.documentElement.style.setProperty('--muted','#9aa6b2');
        document.documentElement.style.setProperty('--accent','#60a5fa');
        document.body.style.color = '#e6eef8';
      } else {
        document.documentElement.style.setProperty('--bg','#f7f8fb');
        document.documentElement.style.setProperty('--muted','#667085');
        document.documentElement.style.setProperty('--accent','#ff6b00');
        document.body.style.color = '#0f1720';
      }
    }
  });

  // Khởi tạo lần đầu
  filterPosts();

  // --- Auth (client-side demo, not secure) ---
  const btnLogin = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');
  const btnAddPost = document.getElementById('btn-add-post');
  const btnLogout = document.getElementById('btn-logout');
  const userInfo = document.getElementById('user-info');
  const userNameEl = document.getElementById('user-name');

  function openModal(id){
    let el = document.getElementById(id);
    if(!el){
      // build modal
      el = document.createElement('div');
      el.className = 'modal-backdrop show';
      el.id = id;
      const modal = document.createElement('div');
      modal.className = 'modal';
      if(id === 'modal-login'){
        modal.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span class="brand-icon" aria-hidden="true"></span>
            <div>
              <h3 style="margin:0">Đăng nhập</h3>
              <div class="modal-sub">Đăng nhập để đăng tin và quản lý tài khoản</div>
            </div>
          </div>
          <div class="form-row"><input id="login-email" placeholder="Email hoặc tên người dùng"></div>
          <div class="form-row"><input id="login-pass" type="password" placeholder="Mật khẩu"></div>
          <div class="actions"><button id="do-login" class="btn">Đăng nhập</button><button id="close-login" class="btn ghost">Đóng</button></div>
        `;
      } else if(id === 'modal-register'){
        modal.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span class="brand-icon" aria-hidden="true"></span>
            <div>
              <h3 style="margin:0">Đăng ký</h3>
              <div class="modal-sub">Tạo tài khoản miễn phí để bắt đầu</div>
            </div>
          </div>
          <div class="form-row"><input id="reg-name" placeholder="Tên hiển thị"></div>
          <div class="form-row"><input id="reg-email" placeholder="Email"></div>
          <div class="form-row"><input id="reg-pass" type="password" placeholder="Mật khẩu"></div>
          <div class="form-row"><input id="reg-pass2" type="password" placeholder="Xác nhận mật khẩu"></div>
          <div class="actions"><button id="do-register" class="btn">Đăng ký</button><button id="close-reg" class="btn ghost">Đóng</button></div>
        `;
      } else if(id === 'modal-add'){
        modal.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span class="brand-icon" aria-hidden="true"></span>
            <div>
              <h3 style="margin:0">Đăng tin</h3>
              <div class="modal-sub">Nhập thông tin sản phẩm để đăng lên trang</div>
            </div>
          </div>
          <div class="form-row"><input id="add-title" placeholder="Tiêu đề"></div>
          <div class="form-row">
            <select id="add-cat">
              <option value="dien-thoai">Điện thoại</option>
              <option value="may-tinh">Máy tính</option>
              <option value="thoi-trang">Thời trang</option>
              <option value="khac">Khác</option>
            </select>
          </div>
          <div class="form-row"><input id="add-price" placeholder="Giá (vd: 1.200.000₫)"></div>
          <div class="form-row"><input id="add-loc" placeholder="Địa điểm"></div>
          <div class="form-row"><input id="add-image" type="file" accept="image/*"></div>
          <div class="form-row"><div id="add-image-preview" class="image-preview" style="display:none"></div></div>
          <div class="form-row"><textarea id="add-excerpt" placeholder="Mô tả ngắn" rows="3"></textarea></div>
          <div class="actions"><button id="do-add" class="btn">Đăng</button><button id="close-add" class="btn ghost">Đóng</button></div>
        `;
      }
      el.appendChild(modal);
      document.body.appendChild(el);

      // attach handlers
      el.addEventListener('click', function(e){ if(e.target === el) closeModal(id); });
      if(id === 'modal-login'){
        document.getElementById('close-login').addEventListener('click', ()=> closeModal(id));
        document.getElementById('do-login').addEventListener('click', handleLogin);
      } else if(id === 'modal-register'){
        document.getElementById('close-reg').addEventListener('click', ()=> closeModal(id));
        document.getElementById('do-register').addEventListener('click', handleRegister);
      } else if(id === 'modal-add'){
        document.getElementById('close-add').addEventListener('click', ()=> closeModal(id));
        document.getElementById('do-add').addEventListener('click', handleAddProduct);
        // preview image when user selects file
        const imgInput = document.getElementById('add-image');
        const preview = document.getElementById('add-image-preview');
        if(imgInput && preview){
          imgInput.addEventListener('change', function(){
            const f = this.files && this.files[0];
            if(!f){ preview.style.display='none'; preview.innerHTML=''; return; }
            const reader = new FileReader();
            reader.onload = function(ev){
              preview.style.display = '';
              preview.innerHTML = `<img src="${ev.target.result}" style="max-width:100%;height:auto;border-radius:8px;">`;
            };
            reader.readAsDataURL(f);
          });
        }
      }
    } else {
      // If backdrop exists but inner modal not yet created, create it now
      if(!el.querySelector('.modal')){
        const modal = document.createElement('div');
        modal.className = 'modal';
        if(id === 'modal-login'){
          modal.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span class="brand-icon" aria-hidden="true"></span>
            <div>
              <h3 style="margin:0">Đăng nhập</h3>
              <div class="modal-sub">Đăng nhập để đăng tin và quản lý tài khoản</div>
            </div>
          </div>
          <div class="form-row"><input id="login-email" placeholder="Email hoặc tên người dùng"></div>
          <div class="form-row"><input id="login-pass" type="password" placeholder="Mật khẩu"></div>
          <div class="actions"><button id="do-login" class="btn">Đăng nhập</button><button id="close-login" class="btn ghost">Đóng</button></div>
        `;
        } else if(id === 'modal-register'){
          modal.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span class="brand-icon" aria-hidden="true"></span>
            <div>
              <h3 style="margin:0">Đăng ký</h3>
              <div class="modal-sub">Tạo tài khoản miễn phí để bắt đầu</div>
            </div>
          </div>
          <div class="form-row"><input id="reg-name" placeholder="Tên hiển thị"></div>
          <div class="form-row"><input id="reg-email" placeholder="Email"></div>
          <div class="form-row"><input id="reg-pass" type="password" placeholder="Mật khẩu"></div>
          <div class="form-row"><input id="reg-pass2" type="password" placeholder="Xác nhận mật khẩu"></div>
          <div class="actions"><button id="do-register" class="btn">Đăng ký</button><button id="close-reg" class="btn ghost">Đóng</button></div>
        `;
        } else if(id === 'modal-add'){
          modal.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span class="brand-icon" aria-hidden="true"></span>
            <div>
              <h3 style="margin:0">Đăng tin</h3>
              <div class="modal-sub">Nhập thông tin sản phẩm để đăng lên trang</div>
            </div>
          </div>
          <div class="form-row"><input id="add-title" placeholder="Tiêu đề"></div>
          <div class="form-row">
            <select id="add-cat">
              <option value="dien-thoai">Điện thoại</option>
              <option value="may-tinh">Máy tính</option>
              <option value="thoi-trang">Thời trang</option>
              <option value="khac">Khác</option>
            </select>
          </div>
          <div class="form-row"><input id="add-price" placeholder="Giá (vd: 1.200.000₫)"></div>
          <div class="form-row"><input id="add-loc" placeholder="Địa điểm"></div>
            <div class="form-row"><label for="add-image">Thêm ảnh</label></div>
            <div class="form-row"><input id="add-image" type="file" accept="image/*"></div>
            <div class="form-row"><div id="add-image-preview" class="image-preview" style="display:none"></div></div>
            <div class="form-row"><textarea id="add-excerpt" placeholder="Mô tả ngắn" rows="3"></textarea></div>
          <div class="actions"><button id="do-add" class="btn">Đăng</button><button id="close-add" class="btn ghost">Đóng</button></div>
        `;
        }
        el.appendChild(modal);

        // attach handlers for newly created inner modal
        el.addEventListener('click', function(e){ if(e.target === el) closeModal(id); });
        if(id === 'modal-login'){
          document.getElementById('close-login').addEventListener('click', ()=> closeModal(id));
          document.getElementById('do-login').addEventListener('click', handleLogin);
        } else if(id === 'modal-register'){
          document.getElementById('close-reg').addEventListener('click', ()=> closeModal(id));
          document.getElementById('do-register').addEventListener('click', handleRegister);
        } else if(id === 'modal-add'){
          document.getElementById('close-add').addEventListener('click', ()=> closeModal(id));
          document.getElementById('do-add').addEventListener('click', handleAddProduct);
        }
      }
      el.classList.add('show');
    }
  }

  function closeModal(id){
    const el = document.getElementById(id);
    if(el) el.classList.remove('show');
  }

  function showMessage(msg){ alert(msg); }

  function getUsers(){
    try{ return JSON.parse(localStorage.getItem('demo_users')||'[]'); }catch(e){return []}
  }
  function saveUsers(u){ localStorage.setItem('demo_users', JSON.stringify(u)); }

  function handleRegister(){
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const pass = document.getElementById('reg-pass').value;
    const pass2 = document.getElementById('reg-pass2').value;
    if(!name||!email||!pass) return showMessage('Vui lòng điền đủ thông tin.');
    if(pass !== pass2) return showMessage('Mật khẩu không khớp.');
    const users = getUsers();
    if(users.find(x=>x.email===email)) return showMessage('Email đã được sử dụng.');
    users.push({name, email, pass});
    saveUsers(users);
    showMessage('Đăng ký thành công. Bạn có thể đăng nhập bây giờ.');
    closeModal('modal-register');
  }

  function handleLogin(){
    const id = document.getElementById('login-email').value.trim().toLowerCase();
    const pass = document.getElementById('login-pass').value;
    if(!id||!pass) return showMessage('Vui lòng điền đủ thông tin.');
    const users = getUsers();
    const u = users.find(x=>x.email===id||x.name.toLowerCase()===id);
    if(!u || u.pass !== pass) return showMessage('Thông tin đăng nhập không đúng.');
    // success
    localStorage.setItem('demo_current_user', JSON.stringify({name:u.name,email:u.email}));
    updateAuthUI();
    closeModal('modal-login');
  }

  function logout(){ localStorage.removeItem('demo_current_user'); updateAuthUI(); }

  function updateAuthUI(){
    const cur = JSON.parse(localStorage.getItem('demo_current_user')||'null');
    if(cur){
      userInfo.style.display = '';
      btnLogin.style.display = 'none';
      btnRegister.style.display = 'none';
      if(btnAddPost) btnAddPost.style.display = '';
      userNameEl.textContent = cur.name || cur.email;
    } else {
      userInfo.style.display = 'none';
      btnLogin.style.display = '';
      btnRegister.style.display = '';
      if(btnAddPost) btnAddPost.style.display = 'none';
      userNameEl.textContent = '';
    }
  }

  btnLogin && btnLogin.addEventListener('click', ()=> openModal('modal-login'));
  btnRegister && btnRegister.addEventListener('click', ()=> openModal('modal-register'));
  btnLogout && btnLogout.addEventListener('click', logout);
  btnAddPost && btnAddPost.addEventListener('click', function(){
    const cur = JSON.parse(localStorage.getItem('demo_current_user')||'null');
    if(!cur){ openModal('modal-login'); return; }
    openModal('modal-add');
  });

  // ensure modals exist hidden initially
  ['modal-login','modal-register'].forEach(id=>{
    if(!document.getElementById(id)){
      const d = document.createElement('div'); d.id = id; d.className = 'modal-backdrop'; document.body.appendChild(d);
    }
  });
  // ensure add modal backdrop exists
  if(!document.getElementById('modal-add')){
    const d = document.createElement('div'); d.id = 'modal-add'; d.className = 'modal-backdrop'; document.body.appendChild(d);
  }

  updateAuthUI();
  // --- Products storage & rendering ---
  // classify title -> category helper
  function classifyCategory(title){
    if(!title) return 'khac';
    const s = title.toString().toLowerCase();
    // phone keywords
    if(/iphone|samsung|xiaomi|oppo|realme|nokia|mobi(le)?|redmi|vsmart/.test(s)) return 'dien-thoai';
    // laptop / computer keywords
    if(/laptop|macbook|dell|asus|acer|thinkpad|surface|cpu|ssd|ram|pc|máy tính|máy tính|imac/.test(s)) return 'may-tinh';
    // fashion keywords
    if(/áo|váy|quần|giày|thời trang|áo khoác|áo thun|váy công sở/.test(s)) return 'thoi-trang';
    return 'khac';
  }
  function getProducts(){
    try{
      const raw = localStorage.getItem('demo_products');
      if(raw){
        const arr = JSON.parse(raw);
        // ensure createdAt exists for legacy items, fix categories for seeded items, and sort newest-first
        arr.forEach((it, idx) => {
          if(!it.createdAt) it.createdAt = Date.now() - (idx * 1000);
          // if this item looks like a seeded/generated item, re-classify category by title to fix miscategorized entries
          try{
            if(it.id && typeof it.id === 'string' && it.id.indexOf('post-seed-') === 0){
              it.cat = classifyCategory(it.title || '');
            }
          }catch(e){}
        });
        arr.sort((a,b)=> (b.createdAt||0) - (a.createdAt||0));
        return arr;
      }
    }catch(e){ }
    // seed from existing DOM posts if none
    const seed = getPostElements().map((el, idx)=>({
      id: el.getAttribute('data-id') || el.id || ('post-'+Date.now()),
      title: el.getAttribute('data-title') || (el.querySelector('.post-title')?.textContent||''),
      cat: el.getAttribute('data-cat') || 'all',
      loc: el.getAttribute('data-loc') || (el.querySelector('.location')?.textContent||''),
      price: el.querySelector('.price')?.textContent || '',
      excerpt: el.querySelector('.post-excerpt')?.textContent || '',
      // assign createdAt for legacy DOM-derived posts (slightly staggered)
      createdAt: Date.now() - (idx * 1000)
    }));
    try{ localStorage.setItem('demo_products', JSON.stringify(seed)); }catch(e){}
    // ensure returned list is sorted newest-first
    seed.sort((a,b)=> (b.createdAt||0) - (a.createdAt||0));
    return seed;
  }
  function saveProducts(products){
    try{ products.sort((a,b)=> (b.createdAt||0) - (a.createdAt||0)); }catch(e){}
    localStorage.setItem('demo_products', JSON.stringify(products));
  }

  function createPostElement(p){
    const art = document.createElement('article');
    art.className = 'post';
    art.id = p.id;
    art.setAttribute('data-id', p.id);
    art.setAttribute('data-title', p.title || '');
    art.setAttribute('data-cat', p.cat || 'all');
    art.setAttribute('data-loc', p.loc || '');
    const bgStyle = p.image ? `background-image:url('${p.image}')` : '';
    art.innerHTML = `
      <div class="post-thumb" aria-hidden="true" style="${bgStyle}"></div>
      <div class="post-body">
        <h3 class="post-title">${p.title || ''}</h3>
        <p class="post-excerpt">${p.excerpt || ''}</p>
        <div class="post-meta">
          <span class="price">${p.price || ''}</span>
          <span class="location">${p.loc || ''}</span>
          <button class="like-btn" data-id="${p.id}" aria-pressed="false" title="Thích">
            <span class="like-icon">♡</span>
            <span class="like-count">0</span>
          </button>
          <button class="delete-btn" data-id="${p.id}" title="Xóa">🗑️</button>
        </div>
      </div>
    `;
    // attach direct handler to delete button to avoid delegation issues
    const delBtn = art.querySelector('.delete-btn');
    if(delBtn){
      delBtn.addEventListener('click', function(evt){
        evt.stopPropagation(); // prevent document-level handler duplication
        const id = this.getAttribute('data-id');
        console.log('[demo] delete button clicked for', id);
        if(confirm('Bạn có chắc muốn xóa bài này?')){
          deleteProductById(id);
        }
      });
    }
    return art;
  }

  function renderProducts(){
    const products = getProducts();
    // clear grid
    if(!postsGrid) return;
    postsGrid.innerHTML = '';
    products.forEach(p => {
      const el = createPostElement(p);
      postsGrid.appendChild(el);
    });
    // refresh likes UI and filtering
    refreshLikeUI();
    filterPosts();
  }

  function handleAddProduct(){
    const title = document.getElementById('add-title')?.value?.trim();
    const cat = document.getElementById('add-cat')?.value || 'khac';
    const price = document.getElementById('add-price')?.value?.trim() || '';
    const loc = document.getElementById('add-loc')?.value?.trim() || '';
    const excerpt = document.getElementById('add-excerpt')?.value?.trim() || '';
    const imgInput = document.getElementById('add-image');
    if(!title) return showMessage('Vui lòng nhập tiêu đề.');
    const products = getProducts();
    const id = 'post-' + Date.now();
  const cur = JSON.parse(localStorage.getItem('demo_current_user')||'null');
  const p = { id, title, cat, price, loc, excerpt, owner: cur ? cur.email : null, createdAt: Date.now() };

    // if image selected, read as DataURL then save; otherwise save immediately
    const file = imgInput && imgInput.files && imgInput.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = function(ev){
        p.image = ev.target.result;
        products.unshift(p); // newest first
        saveProducts(products);
        closeModal('modal-add');
        renderProducts();
        showMessage('Đăng tin thành công.');
      };
      reader.readAsDataURL(file);
    } else {
      products.unshift(p); // newest first
      saveProducts(products);
      closeModal('modal-add');
      renderProducts();
      showMessage('Đăng tin thành công.');
    }
  }

  // If there are fewer than N products, seed some sample posts (useful for testing)
  function seedSampleProductsIfNeeded(count){
    try{
      const products = getProducts();
      if(products.length >= count) return;
      const titles = [
        'iPhone cũ nguyên zin', 'Samsung A Series', 'Laptop Dell cũ', 'MacBook Air 2017', 'Xiaomi Redmi',
        'Áo khoác nam', 'Giày thể thao', 'Balo đi học', 'Tai nghe bluetooth', 'Máy ảnh Canon',
        'Đồng hồ thông minh', 'Bàn phím cơ', 'Chuột chơi game', 'Ổ cứng SSD 512GB', 'Màn hình 24 inch',
        'Áo thun nữ', 'Váy công sở', 'Quần jean', 'Sạc dự phòng', 'Loa Bluetooth'
      ];
      const cats = ['dien-thoai','may-tinh','thoi-trang','khac'];
      const locs = ['Hà Nội','Hồ Chí Minh','Đà Nẵng','Hải Phòng','Cần Thơ','Nha Trang'];
      const prices = ['1.200.000₫','2.900.000₫','3.500.000₫','4.200.000₫','350.000₫','450.000₫','799.000₫','150.000₫'];

      for(let i = products.length; i < count; i++){
        const idx = i % titles.length;
        const title = titles[idx] + (i >= titles.length ? ' #' + (i+1) : '');
        const cat = cats[idx % cats.length];
        const loc = locs[i % locs.length];
        const price = prices[i % prices.length];
        const excerpt = 'Mô tả mẫu cho ' + title + '. Sản phẩm dùng thử để kiểm tra giao diện.';

  // create a simple SVG placeholder image with the title text
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#374151" font-size="28" font-family="Arial, Helvetica, sans-serif">${escapeHtml(title)}</text></svg>`;
  const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);

        const p = {
          id: 'post-seed-' + (Date.now() + i),
          title,
          // classify category by title keywords (more accurate than round-robin)
          cat: classifyCategory(title),
          loc,
          price,
          excerpt,
          image: dataUrl,
          createdAt: Date.now() - ((count - i) * 1000)
        };
        products.push(p);
      }
      saveProducts(products);
    }catch(e){ console.warn('Seed sample products failed', e); }
  }

  // seed up to 20 sample posts for testing, then render
  seedSampleProductsIfNeeded(20);
  renderProducts();
  // --- Likes (client-side demo) ---
  const likeButtons = () => Array.from(document.querySelectorAll('.like-btn'));

  function getLikesMap(){
    try{ return JSON.parse(localStorage.getItem('demo_likes')||'{}'); }catch(e){ return {}; }
  }
  function saveLikesMap(m){ localStorage.setItem('demo_likes', JSON.stringify(m)); }

  // return array of postIds liked by given email
  function getUserLiked(email){ const m = getLikesMap(); return m[email] || []; }

  // toggle like for current user
  function toggleLike(postId){
    const cur = JSON.parse(localStorage.getItem('demo_current_user')||'null');
    if(!cur){ openModal('modal-login'); return; }
    const email = cur.email;
    const m = getLikesMap();
    const arr = m[email] || [];
    const idx = arr.indexOf(postId);
    if(idx === -1){ arr.push(postId); } else { arr.splice(idx,1); }
    m[email] = arr;
    saveLikesMap(m);
    refreshLikeUI();
  }

  // compute counts by aggregating all users' liked arrays
  function computeCounts(){
    const m = getLikesMap();
    const counts = {};
    Object.values(m).forEach(arr => {
      (arr||[]).forEach(id => { counts[id] = (counts[id]||0) + 1; });
    });
    return counts;
  }

  // delete a product and cleanup likes
  function deleteProductById(id){
    try{
      const products = getProducts();
      const idx = products.findIndex(p=>p.id===id);
      if(idx === -1) return showMessage('Không tìm thấy bài.');
      const p = products[idx];
      const cur = JSON.parse(localStorage.getItem('demo_current_user')||'null');
      // only owner can delete (if owner exists)
      if(p.owner && (!cur || cur.email !== p.owner)) return showMessage('Bạn không có quyền xóa bài này.');

      products.splice(idx,1);
      saveProducts(products);

      // remove likes referencing this post
      const likes = getLikesMap();
      let changed = false;
      Object.keys(likes).forEach(email => {
        const arr = likes[email] || [];
        const i = arr.indexOf(id);
        if(i !== -1){ arr.splice(i,1); likes[email] = arr; changed = true; }
      });
      if(changed) saveLikesMap(likes);

      renderProducts();
      showMessage('Bài viết đã được xóa.');
    }catch(e){ console.error('deleteProductById error', e); showMessage('Xóa bài thất bại.'); }
  }

  function refreshLikeUI(){
    const counts = computeCounts();
    const cur = JSON.parse(localStorage.getItem('demo_current_user')||'null');
    const userLiked = cur ? (getUserLiked(cur.email) || []) : [];
    likeButtons().forEach(btn => {
      const id = btn.getAttribute('data-id');
      const cnt = counts[id] || 0;
      const icon = btn.querySelector('.like-icon');
      const cntEl = btn.querySelector('.like-count');
      if(cntEl) cntEl.textContent = cnt;
      if(userLiked.includes(id)){
        btn.classList.add('liked');
        btn.setAttribute('aria-pressed','true');
        if(icon) icon.textContent = '♥';
      } else {
        btn.classList.remove('liked');
        btn.setAttribute('aria-pressed','false');
        if(icon) icon.textContent = '♡';
      }
    });
  }

  // attach click handlers
  document.addEventListener('click', function(e){
    const like = e.target.closest && e.target.closest('.like-btn');
    if(like){
      const id = like.getAttribute('data-id');
      toggleLike(id);
      return;
    }

    const del = e.target.closest && e.target.closest('.delete-btn');
    if(del){
      const id = del.getAttribute('data-id');
      // confirm then delete
      if(confirm('Bạn có chắc muốn xóa bài này?')){
        deleteProductById(id);
      }
      return;
    }

    // open detail when clicking on a post card (but not on buttons/links inside)
    const postEl = e.target.closest && e.target.closest('.post');
    if(postEl){
      // ignore clicks on interactive controls inside post
      if(e.target.closest('.like-btn') || e.target.tagName === 'A' || e.target.closest('button')) return;
      const pid = postEl.getAttribute('data-id') || postEl.id;
      if(pid) openDetail(pid);
    }
  });

  // Open product detail modal
  function openDetail(productId){
    const products = getProducts();
    const p = products.find(x=>x.id === productId);
    if(!p) return showMessage('Không tìm thấy thông tin sản phẩm.');
    const id = 'modal-detail';
    let el = document.getElementById(id);
    if(!el){
      el = document.createElement('div'); el.id = id; el.className = 'modal-backdrop'; document.body.appendChild(el);
    }
    // build inner modal
    el.innerHTML = '';
    const modal = document.createElement('div'); modal.className = 'modal';
    modal.innerHTML = `
      <h3>${escapeHtml(p.title)}</h3>
      <div style="display:flex;gap:12px;flex-direction:column">
        ${p.image ? `<div style="width:100%;height:220px;background-image:url('${p.image}');background-size:cover;background-position:center;border-radius:8px"></div>` : ''}
        <div><strong>Giá:</strong> ${escapeHtml(p.price || '-')}</div>
        <div><strong>Địa điểm:</strong> ${escapeHtml(p.loc || '-')}</div>
        <div style="margin-top:8px">${escapeHtml(p.excerpt || '')}</div>
      </div>
      <div class="actions" style="margin-top:12px"><button id="close-detail" class="btn ghost">Đóng</button></div>
    `;
    el.appendChild(modal);
    el.classList.add('show');
    el.addEventListener('click', function(ev){ if(ev.target === el) closeModal(id); });
    document.getElementById('close-detail').addEventListener('click', ()=> closeModal(id));
  }

  // small helper to escape html in text fields
  function escapeHtml(s){ if(!s) return ''; return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

  // refresh likes UI after auth changes
  const origUpdateAuthUI = updateAuthUI;
  updateAuthUI = function(){ origUpdateAuthUI(); refreshLikeUI(); };

  // initial refresh
  refreshLikeUI();

  // Expose some helpers for debugging from the browser console
  try{
    window._demo_getProducts = getProducts;
    window._demo_renderProducts = renderProducts;
    window._demo_deleteProductById = deleteProductById;
    window._demo_seedSampleProductsIfNeeded = seedSampleProductsIfNeeded;
  }catch(e){ /* ignore when window not writable */ }

})();
