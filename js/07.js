/* Design G — Aura. Light bento-grid register, inspired by a Nitec-style
   consumer-gadget storefront. Renders the shared page data in this
   design's language. */
(function(){
"use strict";
var S = Shop, E = S.esc, M = S.money;
function ic(id,w,h){ return '<svg width="'+w+'" height="'+(h||w)+'"><use href="#'+id+'"/></svg>'; }
function icv(id,w,h){ return '<svg viewBox="0 0 64 44" style="width:'+w+'px;height:'+h+'px"><use href="#'+id+'"/></svg>'; }
/* A handful of catalogue items have a real product-style photo available
   (sourced with the client's confirmation); everything else keeps the
   line-icon treatment rather than mixing in a mismatched placeholder. */
var PHOTO = { 83:"images/stock-headset-white.png", 84:"images/stock-headset-red.png",
              87:"images/stock-speaker.jpg", 80:"images/stock-mouse.jpg" };
function fig(p,w,h){
  return PHOTO[p.id]
    ? '<img src="'+PHOTO[p.id]+'" alt="" style="width:'+w+'px;height:'+h+'px;object-fit:contain">'
    : icv(p.icon,w,h);
}

function header(){
  return '<div class="wrap"><div class="frame"><div class="mast">'+
    '<a class="logo" href="'+S.url("home")+'"><span class="mark">A</span><b>UK Computer Shop</b></a>'+
    '<form class="sbar" role="search">'+
      '<input placeholder="Search '+S.all.length+' products — name, SKU, MPN, brand or spec…">'+
      '<button class="go" type="submit">'+ic("i-search",16,16)+'</button></form>'+
    '<div class="hact"><button class="ib" title="Compare">'+ic("i-scale",18,18)+'</button>'+
      '<button class="ib pink" title="Wishlist">'+ic("i-heart",18,18)+'</button>'+
      '<a class="chip" href="'+S.url("account")+'"><span>Account</span><span class="av">GB</span></a>'+
      '<a class="ib" href="'+S.url("basket")+'" title="Basket">'+ic("i-bag",18,18)+'</a></div>'+
  '</div></div></div>';
}
function footer(){
  return '<div class="wrap"><footer><div class="fg">'+
    '<div><a class="logo" href="'+S.url("home")+'" style="margin-bottom:16px"><span class="mark">A</span><b>UK Computer Shop</b></a>'+
    '<p>Independent UK retailer. Warehouse, build room and test lab in Manchester.</p></div>'+
    '<div><h4>Shop</h4><ul>'+S.CAT_ORDER.slice(0,5).map(function(c){ return '<li><a href="'+S.url("category",{cat:c})+'">'+E(c)+'</a></li>'; }).join("")+'</ul></div>'+
    '<div><h4>Services</h4><ul><li><a href="#">PC configurator</a></li><li><a href="#">Build &amp; test</a></li><li><a href="#">Repairs &amp; upgrades</a></li><li><a href="#">Trade-in</a></li></ul></div>'+
    '<div><h4>Support</h4><ul><li><a href="#">Track order</a></li><li><a href="#">Delivery &amp; returns</a></li><li><a href="#">Warranty / RMA</a></li><li><a href="#">Contact</a></li></ul></div>'+
    '<div><h4>Company</h4><ul><li><a href="'+S.url("brands")+'">All brands</a></li><li><a href="#">About</a></li><li><a href="#">Terms</a></li><li><a href="#">Privacy</a></li></ul></div>'+
    '</div><div class="fb"><span>© 2026 UK Computer Shop Ltd · [Company registration] · [VAT number]</span><span>ALL PRICES INC. VAT</span></div></footer></div>';
}
function crumbs(list){
  return '<div class="wrap"><nav class="crumb">'+list.map(function(c,i){
    var last = i === list.length-1;
    return (i ? '<span>/</span>' : "") + (last ? '<b>'+E(c.label)+'</b>' : '<a href="'+c.href+'">'+E(c.label)+'</a>');
  }).join("")+'</nav></div>';
}
function card(p){
  var st = S.stockText(p);
  return '<article class="card">'+
    '<div class="tags">'+(p.was ? '<span class="tg">-'+Math.round((p.was-p.price)/p.was*100)+'%</span>' : "")+(p.isNew ? '<span class="tg new">NEW</span>' : "")+'</div>'+
    '<button class="fav">'+ic("i-heart",16,16)+'</button>'+
    '<a class="im" href="'+S.url("product",{id:p.id})+'">'+fig(p,150,104)+'</a>'+
    '<div class="bd"><div class="mrow"><a href="'+S.url("brand",{b:p.brand})+'">'+E(p.brand)+'</a><span>'+E(p.sku)+'</span></div>'+
    '<h3><a href="'+S.url("product",{id:p.id})+'">'+E(p.name)+'</a></h3>'+
    '<div class="rate"><i>'+S.stars(p.rating)+'</i>'+p.rating+' · '+p.reviews.toLocaleString("en-GB")+'</div>'+
    '<div class="prow"><b>'+M(p.price)+'</b>'+(p.was ? '<s>'+M(p.was)+'</s>' : "")+'</div>'+
    '<div class="avail">'+(st.cls==="in" ? '<i></i>'+E(st.text) : '<span style="color:var(--'+(st.cls==="low"?"warn":"neg")+')">'+E(st.text)+'</span>')+'</div>'+
    '<div class="crow"><a class="buy" href="#" data-add="'+p.id+'">Add to basket</a><a class="ghost" href="'+S.url("product",{id:p.id})+'">'+ic("i-arr",16,16)+'</a></div>'+
    '</div></article>';
}
function rail(eyebrow, title, sub, items, link){
  if (!items || !items.length) return "";
  return '<section style="padding-top:0"><div class="wrap"><div class="shead"><div><span class="tag">'+E(eyebrow)+'</span><h2>'+E(title)+'</h2>'+
    (sub ? '<p>'+E(sub)+'</p>' : "")+'</div>'+(link ? '<a href="'+link.href+'">'+E(link.label)+' '+ic("i-arr",14,14)+'</a>' : "")+'</div>'+
    '<div class="pgrid">'+items.map(card).join("")+'</div></div></section>';
}

function productPage(){
  var d = Pages.product(); if (!d) return;
  var p = d.p, st = S.stockText(p), keys = Object.keys(p.specs), dist = [72,19,6,2,1];
  var revs = [
    { who:"Daniel H.", v:1, r:5, t:"Dropped straight in, no fuss", b:"Ordered Tuesday afternoon, here Wednesday morning. Idles silently and the packaging was genuinely good — double boxed with foam ends." },
    { who:"Priya S.",  v:1, r:5, t:"Exactly as specified", b:"The spec sheet on the listing matched the product to the letter, which is more than I can say for the marketplace I used before." },
    { who:"Mark T.",   v:0, r:4, t:"Very good, one small niggle", b:"No complaints about performance. Would have liked the older mounting bracket in the box, but that is on the manufacturer." }
  ];
  document.getElementById("app").innerHTML = header() + crumbs(d.crumbs) +
    '<div class="wrap"><div class="pd">'+
      '<div class="gal">'+
        '<div class="main">'+fig(p,280,210)+'</div>'+
        '<div class="thumbs"><span class="on">'+icv(p.icon,44,34)+'</span><span>'+icv(p.icon,44,34)+'</span><span>'+icv(p.icon,44,34)+'</span><span>'+icv(p.icon,44,34)+'</span></div>'+
      '</div>'+
      '<div class="pdinfo">'+
        '<div class="top"><a href="'+S.url("brand",{b:p.brand})+'">'+E(p.brand)+'</a><span class="mono" style="color:var(--dim)">'+E(p.subcategory)+'</span></div>'+
        '<h1>'+E(p.name)+'</h1>'+
        '<div class="rate"><i>'+S.stars(p.rating)+'</i>'+p.rating+' · '+p.reviews.toLocaleString("en-GB")+' reviews · '+p.sold.toLocaleString("en-GB")+' sold</div>'+
        '<div class="idgrid"><div><span>SKU</span><b>'+E(p.sku)+'</b></div><div><span>MPN</span><b>'+E(p.mpn)+'</b></div><div><span>EAN</span><b>'+E(p.ean)+'</b></div></div>'+
        '<div class="specgrid">'+keys.slice(0,6).map(function(k){ return '<div><span>'+E(k)+'</span><b>'+E(p.specs[k])+'</b></div>'; }).join("")+'</div>'+
        '<div class="buyblk">'+
          '<div class="pr"><b>'+M(p.price)+'</b>'+(p.was ? '<s>'+M(p.was)+'</s>' : "")+'</div>'+
          '<div class="ex">'+S.exVat(p.price)+' ex VAT · 0% finance from '+M(p.price/12)+'/mo</div>'+
          '<div class="av '+st.cls+'"><i></i>'+E(st.text)+'</div>'+
          '<div class="buyrow"><div class="qty"><button type="button">−</button><input value="1" data-qty-input><button type="button">+</button></div>'+
            '<a class="b1" href="#" data-add="'+p.id+'" data-qty="input">'+ic("i-bag",15,15)+(st.cls==="out"?"Pre-order":"Add to basket")+'</a></div>'+
          '<ul class="perks"><li>'+ic("i-truck",15,15)+'<span>Free next-day delivery, order before 17:00</span></li>'+
            '<li>'+ic("i-shield",15,15)+'<span>'+E(p.specs.Warranty || "Manufacturer warranty")+' · 30-day UK returns</span></li>'+
            '<li>'+ic("i-wrench",15,15)+'<span>Fitting available at our Manchester workshop</span></li></ul>'+
        '</div>'+
      '</div></div>'+
      '<div class="tabbar"><button class="on" data-tab="spec">Specification</button><button data-tab="reviews">Reviews</button><button data-tab="delivery">Delivery</button></div>'+
      '<div class="tabpane on" id="spec"><table class="spectable">'+
        keys.map(function(k){ return '<tr><th>'+E(k)+'</th><td>'+E(p.specs[k])+'</td></tr>'; }).join("")+
        '<tr><th>Brand</th><td><a href="'+S.url("brand",{b:p.brand})+'" style="font-weight:700">'+E(p.brand)+'</a></td></tr></table></div>'+
      '<div class="tabpane" id="reviews"><div class="rvsum"><div class="rvbig"><b>'+p.rating+'</b><i>'+S.stars(p.rating)+'</i><span>'+p.reviews.toLocaleString("en-GB")+' reviews</span></div>'+
        '<div class="rvbars">'+dist.map(function(v,i){ return '<div><span>'+(5-i)+' star</span><span class="bar"><i style="width:'+v+'%"></i></span><span>'+v+'%</span></div>'; }).join("")+'</div></div>'+
        revs.map(function(r){ return '<div class="rv"><div class="top"><span class="who">'+E(r.who)+(r.v?'<em>VERIFIED</em>':"")+'</span><span class="date">March 2026</span></div>'+
          '<div style="margin-bottom:6px"><i>'+S.stars(r.r)+'</i> <b style="font-size:13px">'+E(r.t)+'</b></div><p>'+E(r.b)+'</p></div>'; }).join("")+'</div>'+
      '<div class="tabpane" id="delivery"><p style="margin:0 0 12px;font-size:13.5px;color:var(--dim)">Free next-day delivery over £75, despatched same day when ordered before 17:00 Monday to Friday. Saturday delivery £7.95 at checkout.</p>'+
        '<p style="margin:0;font-size:13.5px;color:var(--dim)">Returns within 30 days in original packaging. Faulty items go through our RMA process — we collect, test and replace, carriage free both ways.</p></div>'+
    '</div>'+
    rail("Alternatives", "Related products", "Other options on the same shelf, at a similar price.", d.related, { href:S.url("home"), label:"All "+p.subcategory })+
    rail("Complete the build", "Frequently bought together", "Compatibility-checked against this part — socket, memory profile and PSU headroom.", d.alsoBought)+
    rail("For you", "Recommended", d.recentlyViewed.length ? "Based on what you have been looking at." : "Popular right now across the catalogue.", d.recommended)+
    (d.recentlyViewed.length ? rail("History", "Recently viewed", null, d.recentlyViewed.slice(0,4)) : "")+
    footer();
  wireTabs(); document.title = p.name + " — UK Computer Shop";
}
function wireTabs(){
  document.querySelectorAll(".tabbar button").forEach(function(b){
    b.addEventListener("click", function(){
      document.querySelectorAll(".tabbar button").forEach(function(x){ x.classList.remove("on"); });
      document.querySelectorAll(".tabpane").forEach(function(x){ x.classList.remove("on"); });
      b.classList.add("on"); document.getElementById(b.dataset.tab).classList.add("on");
    });
  });
  document.querySelectorAll(".qty button").forEach(function(b){
    b.addEventListener("click", function(){
      var i = document.querySelector(".qty input");
      i.value = Math.max(1, (+i.value||1) + (b.textContent === "+" ? 1 : -1));
    });
  });
}
function brandCard(b){
  return '<a class="bcard" href="'+S.url("brand",{b:b.brand})+'"><span class="mark">'+E(b.brand.slice(0,2).toUpperCase())+'</span>'+
    '<h3>'+E(b.brand)+'</h3><p>'+E(b.note.length>96 ? b.note.slice(0,94)+"…" : b.note)+'</p>'+
    '<span class="meta"><span><b>'+b.count+'</b> lines</span><span><b>'+b.rating.toFixed(1)+'</b>★</span><span>from <b>'+M(b.min).replace(".00","")+'</b></span></span></a>';
}
function brandPage(){
  var d = Pages.brand(); if (!d) return; var b = d.b;
  document.getElementById("app").innerHTML = header() + crumbs(d.crumbs) +
    '<div class="wrap"><div class="bhero">'+
      '<div><div class="mark">'+E(b.brand.slice(0,2).toUpperCase())+'</div><h1>'+E(b.brand)+'</h1><p>'+E(b.note)+'</p></div>'+
      '<div class="bstats"><div><b>'+b.count+'</b><span>Products</span></div><div><b>'+b.rating.toFixed(1)+'</b><span>Avg rating</span></div>'+
      '<div><b>'+M(b.min).replace(".00","")+'</b><span>From</span></div><div><b>'+b.deals+'</b><span>On offer</span></div></div></div>'+
      '<div class="bchips"><a class="on" href="#">All '+b.count+'</a>'+d.subcats.map(function(s2){ return '<a href="'+S.url("category",{sub:s2})+'">'+E(s2)+'<span>'+d.bySub[s2].length+'</span></a>'; }).join("")+'</div></div>'+
    rail("Best sellers", b.brand + " — moving fastest", "Ranked by units shipped over the last 90 days.", d.items.slice(0,4))+
    (d.deals.length ? rail("Reduced", "Current " + b.brand + " offers", "Reduced until Sunday midnight.", d.deals) : "")+
    (d.newest.length ? rail("Just in", "New from " + b.brand, "Most recently added to the catalogue.", d.newest) : "")+
    rail("For you", "Recommended", "Pairs well with " + b.brand + " hardware.", d.recommended)+
    '<section style="padding-top:0"><div class="wrap"><div class="shead"><div><span class="tag">Alternatives</span><h2>Other brands to consider</h2>'+
      '<p>Stocked in the same categories as '+E(b.brand)+'.</p></div><a href="'+S.url("brands")+'">All brands '+ic("i-arr",14,14)+'</a></div>'+
      '<div class="bgrid">'+d.siblings.slice(0,4).map(brandCard).join("")+'</div></div></section>'+
    footer();
  document.title = b.brand + " — UK Computer Shop";
}
function brandsPage(){
  var d = Pages.brands();
  document.getElementById("app").innerHTML = header() + crumbs(d.crumbs) +
    '<div class="wrap"><div class="shead" style="margin-top:8px"><div><span class="tag">Manufacturers</span><h2>All brands</h2>'+
      '<p>'+d.all.length+' manufacturers, '+d.totalProducts.toLocaleString("en-GB")+' products. Every brand page carries live stock, current offers and new arrivals.</p></div></div>'+
      '<div class="alpha">'+"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function(L){
        return d.letters[L] ? '<a href="#L'+L+'">'+L+'</a>' : '<a class="dim">'+L+'</a>'; }).join("")+'</div>'+
      '<div class="bgrid" style="margin-bottom:26px">'+d.featured.map(brandCard).join("")+'</div>'+
      d.keys.map(function(L){
        return '<div class="azblock" id="L'+L+'"><div class="L">'+L+'</div><div class="azlist">'+
          d.letters[L].map(function(b){ return '<a href="'+S.url("brand",{b:b.brand})+'">'+E(b.brand)+'<span>'+b.count+'</span></a>'; }).join("")+'</div></div>';
      }).join("")+'</div>'+
    rail("For you", "Recommended", "Popular across the brands you have been browsing.", d.recommended)+
    footer();
  document.title = "All brands — UK Computer Shop";
}
window.DesignG = { product:productPage, brand:brandPage, brands:brandsPage,
  parts:{ header:header, footer:footer, crumbs:crumbs, card:card, brandCard:brandCard,
          section:function(t,n,i,l){ return rail(t, t, n, i, l); } } };
})();
