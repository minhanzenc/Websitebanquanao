function numberWithCommas (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")
}
async function getDMSP(){
    try{
        const config = {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res  = await fetch('http://127.0.0.1:8000/danhmuc/',config)
        if(res.status === 200){
            const data = await res.json()
            console.log(data)
            const menu = document.getElementById('menuContainer')
            data.forEach(danhmuc => {
                menu.innerHTML += `
                <a class="dropdown-item" href="menu.html?id=${danhmuc.id}">${danhmuc.ten_danh_muc}</a>
                `
            })
            
        }
        else{
            console.log("loi")
        }
    } catch(err){
        console.log(err)
    }
}
getDMSP();

async function getLoaiSP(){
    try{
        const config = {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('id');
        const res  = await fetch(`http://127.0.0.1:8000/loaisanpham/?id=${myParam}`,config)
        if(res.status === 200){
            const data = await res.json()
            console.log(data)
            const loai_san_pham = document.getElementById('tenLoai')
            console.log(myParam)
            data.forEach(loai_sp => {
                loai_san_pham.innerHTML += 
                `  
                    <button data-filter=".${loai_sp.id}">${loai_sp.ten_loai}</button>
                `
            });
        }
        else{
            console.log("loi")
        }
    } catch(err){
        console.log(err)
    }
}

async function getSanPham(){
    try{
        const config = {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('id');
        const res = await fetch(`http://127.0.0.1:8000/sanpham/?danh_muc=${myParam}`,config)
        if(res.status === 200){
            const productList = await res.json()
            productContainer = document.getElementById('productContainer')
            productContainer.innerHTML= ''
                productList.results.forEach(product => {
                    let chi_tiet = ""
                    product.chitietsanpham_set.forEach(e => {
                        chi_tiet += `
                            <option value=${e.id}>${e.size} - ${e.mau_sac}</option>
                        `
                    })
                    productContainer.innerHTML += 
                    `   <div class="col-lg-4 col-md-6 special-grid ${product.loai_san_pham}">
                            <div class="gallery-single fix">
                                <img src=${product.chitietsanpham_set[0].hinh} class="img-fluid" alt="Image">
                                <div class="why-text" >
                                    <h4>${product.ten_san_pham}</h4>
                                    <p>${product.gioi_thieu}</p>
                                    <select id="sanphamchon${product.id}">
                                        ${chi_tiet}
                                    </select>
                                    <h5> ${numberWithCommas(product.gia)} VND</h5>
                                    <button onclick="addToCart(${product.id},'${product.ten_san_pham}',${product.gia}, '${product.chitietsanpham_set[0].hinh}')">thêm giỏ hàng</button>
                                </div>
                            </div>
                        </div>
                    `
                });
        }
        else{
            console.log("loi")
        }
    } catch(err){
        console.log(err)
    }
}
getLoaiSP();
getSanPham()