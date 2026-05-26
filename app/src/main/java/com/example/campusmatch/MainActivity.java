package com.example.campusmatch;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.example.campusmatch.ui.home.HomeFragment;
import com.example.campusmatch.ui.marketplace.MarketplaceFragment;
import com.example.campusmatch.ui.publish.PublishFragment;
import com.example.campusmatch.ui.match.MatchFragment;
import com.example.campusmatch.ui.seller.SellerFragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;

/**
 * 主Activity —— 底部导航 + Fragment容器
 * 实现HomeFragment.OnNavigateListener以支持Fragment间跳转
 */
public class MainActivity extends AppCompatActivity implements HomeFragment.OnNavigateListener {

    private BottomNavigationView bottomNav;

    // Fragment实例，保留状态
    private HomeFragment homeFragment;
    private MarketplaceFragment marketplaceFragment;
    private PublishFragment publishFragment;
    private MatchFragment matchFragment;
    private SellerFragment sellerFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        bottomNav = findViewById(R.id.main_bottom_nav);

        // 默认显示首页
        if (savedInstanceState == null) {
            showFragment(0);
        }

        // 底部导航切换监听
        bottomNav.setOnItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_home) {
                showFragment(0);
            } else if (id == R.id.nav_marketplace) {
                showFragment(1);
            } else if (id == R.id.nav_publish) {
                showFragment(2);
            } else if (id == R.id.nav_match) {
                showFragment(3);
            } else if (id == R.id.nav_seller) {
                showFragment(4);
            }
            return true;
        });
    }

    /**
     * 根据索引切换Fragment
     */
    private void showFragment(int index) {
        Fragment target = null;
        String tag = "";

        switch (index) {
            case 0:
                if (homeFragment == null) homeFragment = new HomeFragment();
                target = homeFragment;
                tag = "home";
                break;
            case 1:
                if (marketplaceFragment == null) marketplaceFragment = new MarketplaceFragment();
                target = marketplaceFragment;
                tag = "marketplace";
                break;
            case 2:
                if (publishFragment == null) publishFragment = new PublishFragment();
                target = publishFragment;
                tag = "publish";
                break;
            case 3:
                if (matchFragment == null) matchFragment = new MatchFragment();
                target = matchFragment;
                tag = "match";
                break;
            case 4:
                if (sellerFragment == null) sellerFragment = new SellerFragment();
                target = sellerFragment;
                tag = "seller";
                break;
        }

        if (target != null && !target.isAdded()) {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.main_fragment_container, target, tag)
                    .commit();
        }
    }

    /**
     * 实现OnNavigateListener，支持从HomeFragment跳转到其他Tab
     */
    @Override
    public void navigateTo(int menuItemId) {
        bottomNav.setSelectedItemId(menuItemId);
    }

    @Override
    public void onBackPressed() {
        // 如果不在首页，返回首页
        if (bottomNav.getSelectedItemId() != R.id.nav_home) {
            bottomNav.setSelectedItemId(R.id.nav_home);
        } else {
            super.onBackPressed();
        }
    }
}