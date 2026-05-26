package com.example.campusmatch.ui.home;

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
 * 首页 —— Hero、分类、AI功能展示、推荐商品瀑布流、数据看板
 */
public class HomeFragment extends Fragment {

    private LinearLayout productContainer;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);
        productContainer = view.findViewById(R.id.home_product_container);

        // 加载推荐商品（前6条）
        loadRecommendedProducts();

        // 按钮点击事件
        view.findViewById(R.id.home_btn_publish).setOnClickListener(v -> {
            // 切换到发布页——通过接口或直接找MainActivity切tab
            if (getActivity() instanceof OnNavigateListener) {
                ((OnNavigateListener) getActivity()).navigateTo(R.id.nav_publish);
            }
        });

        view.findViewById(R.id.home_btn_match).setOnClickListener(v -> {
            if (getActivity() instanceof OnNavigateListener) {
                ((OnNavigateListener) getActivity()).navigateTo(R.id.nav_match);
            }
        });

        return view;
    }

    /**
     * 动态生成推荐商品卡片
     */
    private void loadRecommendedProducts() {
        List<Product> products = MockData.generateProducts();
        // 取前6个作为推荐
        int count = Math.min(6, products.size());
        for (int i = 0; i < count; i++) {
            Product p = products.get(i);
            View card = createProductCard(p);
            productContainer.addView(card);
        }
    }

    /**
     * 动态生成一个商品卡片
     */
    private View createProductCard(Product p) {
        View card = LayoutInflater.from(getContext())
                .inflate(R.layout.item_product_card, productContainer, false);

        // 商品emoji
        TextView tvEmoji = card.findViewById(R.id.card_product_emoji);
        tvEmoji.setText(p.getImageEmoji());

        // 标签
        LinearLayout tagContainer = card.findViewById(R.id.card_tags_container);
        tagContainer.removeAllViews();
        if (p.isUrgent()) {
            tagContainer.addView(createTagView("急售", R.drawable.bg_tag_yellow));
        }
        if (p.isRecommended()) {
            tagContainer.addView(createTagView("推荐", R.drawable.bg_tag_blue));
        }
        tagContainer.addView(createTagView(p.getCategory(), R.drawable.bg_tag_blue));
        tagContainer.addView(createTagView(p.getCondition(), R.drawable.bg_tag_blue));

        // 标题
        TextView tvTitle = card.findViewById(R.id.card_title);
        tvTitle.setText(p.getTitle());

        // 价格
        TextView tvPrice = card.findViewById(R.id.card_price);
        tvPrice.setText("¥" + (int) p.getCurrentPrice());

        TextView tvOrigPrice = card.findViewById(R.id.card_orig_price);
        tvOrigPrice.setText("¥" + (int) p.getOriginalPrice());

        TextView tvSaved = card.findViewById(R.id.card_saved);
        tvSaved.setText("省¥" + (int) p.getSavedAmount());

        // 位置和时间
        TextView tvLocation = card.findViewById(R.id.card_location);
        tvLocation.setText(p.getLocation());

        // AI匹配度
        TextView tvMatchScore = card.findViewById(R.id.card_match_score);
        tvMatchScore.setText("🤖 AI匹配度 " + p.getAiMatchScore() + "%");

        // 点击查看详情
        card.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), ProductDetailActivity.class);
            intent.putExtra("product_id", p.getId());
            startActivity(intent);
        });

        return card;
    }

    private TextView createTagView(String text, int bgRes) {
        TextView tag = new TextView(getContext());
        tag.setText(text);
        tag.setTextSize(10);
        tag.setTextColor(getResources().getColor(R.color.text_primary, null));
        tag.setBackgroundResource(bgRes);
        tag.setPadding(12, 3, 12, 3);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.setMargins(0, 0, 8, 0);
        tag.setLayoutParams(params);
        return tag;
    }

    /**
     * 导航接口——让Fragment通知MainActivity切换Tab
     */
    public interface OnNavigateListener {
        void navigateTo(int menuItemId);
    }
}