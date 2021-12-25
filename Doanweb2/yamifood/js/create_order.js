
async function createOrder(){
    const carts = store.getState()
    const address = document.getElementById('address').value
    const token = localStorage.getItem('access_token')

    if(address == ''){
        alert('chưa nhập địa chỉ giao hang')
        return
    }

    if(carts.length == 0 ){
        alert('chưa có sản phẩm trong giỏ hàng')
        return
    }

    if(token == null){
        location.href= 'login.html'
    }

    try {
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                details: carts.map(cart => {return {pID: cart.id, quantity: cart.quantity} })
            })
        }
    
        const res = await fetch('http://127.0.0.1:8000/donhang/',config)
        if(res.status === 201){
            alert('Đặt hàng thành công')
            localStorage.removeItem('cart')
            location.href='create_order.html'
        }

    } catch (error) {
        console.log(error)
    }
}

const formatDate = (date) => {
    if (date !== null) {
        const temp = new Date(date)
        return `0${temp.getDate()}`.slice(-2) + '-' + `0${temp.getMonth() + 1}`.slice(-2) + '-' + temp.getFullYear()
    }
    else
        return "Đang chò giao hàng"

}

async function getOrder(){
    const token = localStorage.getItem('access_token')
    const statusOrder = document.getElementById('statusOrder')
    if(statusOrder == null) return
    try{
        const config = {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }

        const res = await fetch(`http://127.0.0.1:8000/donhang/`,config)
        if(res.status === 200){
            const data = await res.json()
            statusOrder.innerHTML =''
            data.forEach(donhang => {
                let san_pham = ''
                donhang.chitietdonhang_set.forEach(chitiet => {
                    san_pham +=  `${chitiet.chi_tiet_san_pham.ten_san_pham} - ${chitiet.so_luong}<br />`
                })
                statusOrder.innerHTML +=
                `
                <tr>
                <th scope="row">${donhang.id}</th>
                <td>${formatDate(donhang.ngay_tao)}</td>
                <td>${san_pham}</td>
                <td>${donhang.tinh_trang}</td>
            </tr>
                `
                
            });
    
            console.log(data)
        }else{
            console.log(loi)
        }

    }catch(err){
        console.log(err)
    }
}
getOrder();