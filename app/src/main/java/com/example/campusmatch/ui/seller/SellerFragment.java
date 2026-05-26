package com.example.campusmatch.ui.seller;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.campusmatch.ProductDetailActivity;
import com.example.campusmatch.R;
import com.example.campusmatch.data.MockData;
import com.example.campusmatch.model.Product;

import java.util.List;

/**
 * 卖家助手 —— 数据概览、商品管理、智能工具
 */
public class SellerFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_seller, container, false);

        LinearLayout productList = view.findViewById(R.id.seller_product_list);
        List<Product> products = MockData.generateProducts();

        // 只展示前3个作为"我的商品"
        int count = Math.min(3, products.size());
        for (int i = 0; i < count; i++) {
            Product p = products.get(i);
            View itemView = createSellerProductItem(p, productList);
            productList.addView(itemView);
        }

        return view;
    }

    /**
     * 创建卖家商品列表项
     */
    private View createSellerProductItem(Product p, ViewGroup parent) {
        LinearLayout item = new LinearLayout(getContext());
        item.setOrientation(LinearLayout.HORIZONTAL);
        item.setBackgroundResource(R.drawable.bg_card_white);
        item.setPadding(12, 12, 12, 12);
        item.setClickable(true);
        item.setFocusable(true);
        item.setForeground(getResources().getDrawable(
                android.R.attr.selectableItemBackground, null));

        // 缩略图
        TextView emoji = new TextView(getContext());
        emoji.setText(p.getImageEmoji());
        emoji.setTextSize(28);
        emoji.setGravity(android.view.Gravity.CENTER);
        emoji.setLayoutParams(new LinearLayout.LayoutParams(48, 48));
        item.addView(emoji);

        // 信息区
        LinearLayout info = new LinearLayout(getContext());
        info.setOrientation(LinearLayout.VERTICAL);
        info.setPadding(10, 0, 0, 0);
        LinearLayout.LayoutParams infoParams = new LinearLayout.LayoutParams(
                0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        info.setLayoutParams(infoParams);

        TextView title = new TextView(getContext());
        title.setText(p.getTitle());
        title.setTextSize(13);
        title.setTextColor(getResources().getColor(R.color.text_primary, null));
        title.setMaxLines(1);
        title.setEllipsize(android.text.TextUtils.TruncateAt.END);
        info.addView(title);

        TextView data = new TextView(getContext());
        data.setText("¥" + (int) p.getCurrentPrice() + " · " + p.getCondition()
                + " · 浏览" + p.getViewCount() + " · 咨询" + p.getInquiryCount()
                + " · 收藏" + p.getFavoriteCount());
        data.setTextSize(10);
        data.setTextColor(getResources().getColor(R.color.text_secondary, null));
        info.addView(data);

        item.addView(info);

        // 操作按钮
        TextView editBtn = new TextView(getContext());
        editBtn.setText("编辑");
        editBtn.setTextSize(11);
        editBtn.setTextColor(getResources().getColor(R.color.blue_primary, null));
        editBtn.setBackgroundResource(R.drawable.btn_secondary_outline);
        editBtn.setPadding(14, 6, 14, 6);
        LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        btnParams.gravity = android.view.Gravity.CENTER_VERTICAL;
        btnParams.setMargins(8, 0, 4, 0);
        editBtn.setLayoutParams(btnParams);
        item.addView(editBtn);

        // 点击进入详情
        item.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), ProductDetailActivity.class);
            intent.putExtra("product_id", p.getId());
            startActivity(intent);
        });

        // 外边距
        LinearLayout.LayoutParams itemParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        itemParams.setMargins(0, 0, 0, 10);
        item.setLayoutParams(itemParams);

        return item;
    }
}