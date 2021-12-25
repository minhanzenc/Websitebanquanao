from django.contrib import admin
from .models import *
# Register your models here.
from django.contrib.auth.admin import UserAdmin as UserSite

class KhachHangAdmin(UserSite):

    fieldsets = (
        ("User Login", {'fields': ('username',)}),
        ("Permission", {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ("Information", {'fields': ('email','first_name', 'last_name', 'dia_chi')}),
    )

    add_fieldsets = (
        ("User Login", {'fields': ('username', 'password1', 'password2')}),
        ("Permission", {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ("Information", {'fields': ('email','first_name', 'last_name', 'dia_chi')})
    )

    def get_queryset(self, request):
        if request.user.is_superuser:
            return KhachHang.objects.all()

        if request.user.role == 'SELLER':
            return KhachHang.objects.filter(id = request.user.id)
        return KhachHang.objects.none()
class ChitietsanphamInline(admin.StackedInline):
    model = ChiTietSanPham

class SanPhamAdmin(admin.ModelAdmin):
    inlines = [ChitietsanphamInline]

class ChitietDonHangInline(admin.StackedInline):
    model = ChiTietSanPham
    model = ChiTietDonHang

class DonHangAdmin(admin.ModelAdmin):
    inlines = [ChitietDonHangInline]
    list_display = ('id', 'tong_tien', 'tinh_trang', 'ngay_tao','ten_khach_hang','sdt','dia_chi','email')
    readonly_fields = ('ngay_tao','ten_khach_hang','sdt','dia_chi','email',)

    def ten_khach_hang(self, obj):
        return obj.khach_hang.first_name + ' ' + obj.khach_hang.last_name

    def sdt(self, obj):
        return obj.khach_hang.so_dien_thoai

    def dia_chi(self, obj):
        return obj.khach_hang.dia_chi

    def email(self, obj):
        return obj.khach_hang.email

admin.site.register(KhachHang,KhachHangAdmin)
admin.site.register(SanPham,SanPhamAdmin )
admin.site.register(LoaiSanPham)
admin.site.register(DanhMucSanPham)
admin.site.register(DonHang,DonHangAdmin)
admin.site.register(ChiTietDonHang)
admin.site.register(KhuyenMai)