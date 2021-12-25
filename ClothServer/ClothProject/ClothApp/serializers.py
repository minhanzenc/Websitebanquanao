from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer
from .models import *
class KhacHangSerializer(ModelSerializer):

    class Meta:
        model = KhachHang
        fields = [ 'username', 'password', 'first_name', 'last_name', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        print(validated_data)
        account = KhachHang(**validated_data)

        account.set_password(validated_data['password'])
        account.save()

        return account

class ChiTietSanPhamSerializer(ModelSerializer):
    ten_san_pham = SerializerMethodField()

    def get_ten_san_pham(self,obj):
        return obj.san_pham.ten_san_pham

    class Meta:
        model=ChiTietSanPham
        fields= ['id', 'size', 'mau_sac', 'ten_san_pham', 'hinh']

class SanPhamSerializer(ModelSerializer):
    chitietsanpham_set=ChiTietSanPhamSerializer(many=True,read_only=True)
    class Meta:
        model=SanPham
        fields=['id',"ten_san_pham","gioi_thieu","loai_san_pham","gia","chitietsanpham_set"]

class LoaiSanPhamSerializer(ModelSerializer):
    class Meta:
        model=LoaiSanPham
        fields=["id", "ten_loai","danh_muc_san_pham"]

class ChiTietDonHangSerializer(ModelSerializer):
    chi_tiet_san_pham = ChiTietSanPhamSerializer(read_only=True)
    class Meta:
        model=ChiTietDonHang
        fields= ['id', 'so_luong', 'chi_tiet_san_pham']

class DonHangSerializer(ModelSerializer):
    chitietdonhang_set = ChiTietDonHangSerializer(many=True, read_only= True)
    tinh_trang = SerializerMethodField()
    def get_tinh_trang(self, obj):
        return obj.get_tinh_trang_display()

    class Meta:
        model=DonHang
        fields=["id","tong_tien","ngay_tao","tinh_trang","khach_hang", 'chitietdonhang_set']
class DanhMucSanPhamSerializer(ModelSerializer):
    class Meta:
        model=DanhMucSanPham
        fields='__all__'
class KhuyenMaiSerializer(ModelSerializer):
    class Meta:
        model=KhuyenMai
        fields='__all__'

