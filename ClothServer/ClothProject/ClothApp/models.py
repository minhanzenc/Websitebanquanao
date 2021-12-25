from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator

class KhachHang(AbstractUser):
    so_dien_thoai = models.CharField(max_length=11)
    dia_chi = models.CharField(max_length=100)

class DonHang(models.Model):
    tong_tien = models.BigIntegerField(validators=[MinValueValidator(1)])
    ngay_tao = models.DateTimeField(auto_now_add=True)

    class TINH_TRANG_DON_HANG(models.IntegerChoices):
        dang_cho = 1, ('don hang dang cho')
        dang_giao = 2, ('don hàng dang giao')
        thanh_cong = 3, ('don hang thanh cong ')
        that_bai = 4, ('don hang that bai ')

    tinh_trang = models.IntegerField(choices=TINH_TRANG_DON_HANG.choices,
                                 default=1)
    # ctsp = models.ManyToManyField('ctsp',through_fields='ctdh')
    khach_hang=models.ForeignKey('KhachHang',on_delete=models.CASCADE)
class  SanPham (models.Model):
    ten_san_pham=models.CharField(max_length=100)
    gia=models.BigIntegerField(validators=[MinValueValidator(1)])
    gioi_thieu=models.TextField()
    loai_san_pham=models.ForeignKey('LoaiSanPham',on_delete=models.CASCADE)

    def __str__(self):
        return self.ten_san_pham;

class ChiTietSanPham(models.Model):
    so_luong=models.IntegerField()
    SIZE_CHON=(
        ('S','Nho'),
        ('M','Vua'),
        ('L','Lon'),
        ('XL','Sieu Lon'),
    )
    size=models.CharField(choices= SIZE_CHON,default='S',max_length=2)
    mau_sac=models.CharField(max_length=50)
    san_pham = models.ForeignKey('SanPham', on_delete=models.CASCADE)
    hinh = models.ImageField(upload_to='static/hinh/sanpham')

    def __str__(self):
        return self.san_pham.ten_san_pham + ' ' + self.size + ' ' + self.mau_sac

class ChiTietDonHang(models.Model):
    so_luong=models.IntegerField()
    chi_tiet_san_pham=models.ForeignKey('ChiTietSanPham',on_delete=models.CASCADE)
    don_hang=models.ForeignKey('DonHang',on_delete=models.CASCADE)

class LoaiSanPham(models.Model):
    ten_loai=models.CharField(max_length=100)
    danh_muc_san_pham=models.ForeignKey('DanhMucSanPham',on_delete=models.CASCADE)

    def __str__(self):
        return self.ten_loai

class DanhMucSanPham(models.Model):
    ten_danh_muc=models.CharField(max_length=50)

    def __str__(self):
        return self.ten_danh_muc

class KhuyenMai(models.Model):
    gia_giam=models.BigIntegerField(validators=[MinValueValidator(1)])
    ngay_ap_dung=models.DateTimeField(null=True,blank=True)
    ngay_ket_thuc=models.DateTimeField()
    don_hang=models.OneToOneField('DonHang',on_delete=models.CASCADE,blank=True,null=True)