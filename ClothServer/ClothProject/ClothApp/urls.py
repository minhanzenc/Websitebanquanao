
from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('khachhang',views.KhachHangViewset)
router.register('sanpham',views.SanPhamViewset)
router.register('loaisanpham',views.LoaiSanPhamViewset)
router.register('donhang',views.DonHangViewset)
router.register('danhmuc',views.DanhMucSanPhamViewset)
urlpatterns = [
    path('', include(router.urls)),
]
