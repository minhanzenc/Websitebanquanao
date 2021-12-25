from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, generics, status
from rest_framework.response import Response

from .models import *
from .paginations import DefaultPagination
from .serializers import *
from .permissions import *

class KhachHangViewset(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView, generics.RetrieveAPIView):
    queryset = KhachHang.objects.filter(is_active = 1)
    serializer_class = KhacHangSerializer
    permission_classes = [KhachHangPermission]

class SanPhamViewset(viewsets.ViewSet,generics.RetrieveAPIView , generics.ListAPIView):
    queryset = SanPham.objects.all()
    serializer_class = SanPhamSerializer
    pagination_class = DefaultPagination

    def list(self, request, *args, **kwargs):
        ten = request.query_params.get('ten')
        danh_muc = request.query_params.get('danh_muc')
        if(ten):
            self.queryset = SanPham.objects.filter(ten_san_pham__icontains = ten)
        if(danh_muc):
            self.queryset = SanPham.objects.filter(loai_san_pham__danh_muc_san_pham__id = danh_muc)
        page = self.paginate_queryset(self.queryset)
        return self.get_paginated_response(self.serializer_class(page, many=True, context={'request': request}).data)

class LoaiSanPhamViewset(viewsets.ViewSet,generics.ListAPIView):
    queryset = LoaiSanPham.objects.all()
    serializer_class = LoaiSanPhamSerializer
    def list(self, request, *args, **kwargs):
        id = request.query_params.get('id')
        if(id):
            self.queryset = LoaiSanPham.objects.filter(danh_muc_san_pham__id = id)
        return Response(data=self.serializer_class(self.queryset,many=True).data,status=status.HTTP_200_OK)
class DonHangViewset(viewsets.ViewSet,generics.ListAPIView,generics.DestroyAPIView,generics.CreateAPIView):
    queryset = DonHang.objects.all()
    serializer_class =DonHangSerializer
    pagination_class = DefaultPagination


    def list(self, request, *args, **kwargs):
        try:
            self.queryset = DonHang.objects.filter(khach_hang = request.user)
            return Response(status=status.HTTP_200_OK, data= self.serializer_class(self.queryset,many=True).data)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        orderData = request.data
        orderDetailData = request.data.get('details')
        del orderData['details']
        try:
            order = DonHang.objects.create(khach_hang = request.user, tong_tien = 0)
            total_price = 0

            for detail in orderDetailData:
                product = ChiTietSanPham.objects.get(pk=detail['pID'])
                if product.so_luong >= detail['quantity']:
                    product.so_luong -= detail['quantity']
                    product.save()
                else:
                    order.delete()
                    return Response(status=status.HTTP_400_BAD_REQUEST,
                                    data={"message": "so luong hang trong kho khong du"})

                order_detail = ChiTietDonHang.objects.create(don_hang=order, chi_tiet_san_pham=product, so_luong=detail['quantity'])
                order_detail.save()
                san_pham =SanPham.objects.get(pk =  product.san_pham.id)
                total_price += san_pham.gia * order_detail.so_luong
            order.tong_tien = total_price
            order.save()
            return Response(status=status.HTTP_201_CREATED, data=self.serializer_class(order).data)

        except Exception as e:
            print(e.__class__.__str__(e))
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": e.__class__.__str__(e)})


class DanhMucSanPhamViewset(viewsets.ViewSet,generics.ListAPIView):
    queryset = DanhMucSanPham.objects.all()
    serializer_class = DanhMucSanPhamSerializer

