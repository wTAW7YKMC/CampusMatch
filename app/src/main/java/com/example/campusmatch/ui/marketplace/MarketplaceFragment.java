package com.example.campusmatch.ui.marketplace;

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
 * 商品广场 —— 筛选栏 + 商品列表
 */
public class MarketplaceFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_marketplace, container, false);

        LinearLayout productContainer = view.findViewById(R.id.marketplace_product_container);

        // 加载全部商品
        List<Product> products = MockData.generateProducts();
        for (Product p : products) {
            View card = createProductCard(p, productContainer);
            productContainer.addView(card);
        }

        return view;
    }

    private View createProductCard(Product p, ViewGroup parent) {
        View card = LayoutInflater.from(getContext())
                .inflate(R.layout.item_product_card, parent, false);

        ((TextView) card.findViewById(R.id.card_product_emoji)).setText(p.getImageEmoji());

        LinearLayout tagContainer = card.findViewById(R.id.card_tags_container);
        tagContainer.removeAllViews();
        if (p.isUrgent()) {
            tagContainer.addView(createTag("急售", R.drawable.bg_tag_yellow));
        }
        if (p.isRecommended()) {
            tagContainer.addView(createTag("推荐", R.drawable.bg_tag_blue));
        }
        tagContainer.addView(createTag(p.getCategory(), R.drawable.bg_tag_blue));
        tagContainer.addView(createTag(p.getCondition(), R.drawable.bg_tag_blue));

        ((TextView) card.findViewById(R.id.card_title)).setText(p.getTitle());
        ((TextView) card.findViewById(R.id.card_price)).setText("¥" + (int) p.getCurrentPrice());
        ((TextView) card.findViewById(R.id.card_orig_price)).setText("¥" + (int) p.getOriginalPrice());
        ((TextView) card.findViewById(R.id.card_saved)).setText("省¥" + (int) p.getSavedAmount());
        ((TextView) card.findViewById(R.id.card_location)).setText(p.getLocation());
        ((TextView) card.findViewById(R.id.card_match_score)).setText(
                "🤖 AI匹配度 " + p.getAiMatchScore() + "%");

        card.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), ProductDetailActivity.class);
            intent.putExtra("product_id", p.getId());
            startActivity(intent);
        });

        return card;
    }

    private TextView createTag(String text, int bgRes) {
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
}