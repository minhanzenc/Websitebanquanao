//lay du lieu

function numberWithCommas (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")
}
document.getElementById('searchForm').addEventListener("submit", (e) => {
    e.preventDefault()
    const timkiem = document.getElementById('searchInput').value
    location.href= `search.html?timkiem=${timkiem}`
})

async function getProducts(){
    const listProduct = document.getElementById('listProduct')
    if(listProduct == null) return
    try{
        const config = {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('timkiem') || '';
        const res = await fetch(`http://127.0.0.1:8000/sanpham/?ten=${myParam}`,config)
        if(res.status === 200){
            const data = await res.json()
            listProduct.innerHTML = ''
            if(data.results.length !== 0 )
                data.results.forEach(product => {
                    let chi_tiet = ""
                    product.chitietsanpham_set.forEach(e => {
                        chi_tiet += `
                            <option value=${e.id}>${e.size} - ${e.mau_sac}</option>
                        `
                    })
                    listProduct.innerHTML += 
                    `   <div class="col-lg-4 col-md-6 special-grid dinner">
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
            else
                listProduct.innerHTML = `<h1 style="text-align:center"> Không tìm thấy sản phẩm tương ứng</h1>`
        }
        else{
            console.log("loi")
        }
    } catch(err){
        console.log(err)
    }
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

function logout(){
    localStorage.clear()
    alert("đăng xuất thành công")
    location.reload()
}
function headerMenu(){
    const token = localStorage.getItem('access_token')
    console.log(token)
    if(token== null || token== undefined) return


    const headerUserContainer = document.getElementById('headerContainer')
    headerUserContainer.innerHTML = ""
    headerUserContainer.innerHTML = `
        <a class="dropdown-item" href="#">Xem thông tin tai khoan</a>
        <a onclick="logout()"href="#" class="dropdown-item" href="#">Đăng xuất</a>

	`
}
getDMSP();
getProducts();
headerMenu( )