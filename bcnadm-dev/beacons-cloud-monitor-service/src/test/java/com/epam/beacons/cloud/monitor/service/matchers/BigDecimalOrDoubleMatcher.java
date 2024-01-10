package com.epam.beacons.cloud.monitor.service.matchers;

import java.math.BigDecimal;
import org.hamcrest.BaseMatcher;
import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.number.BigDecimalCloseTo;
import org.hamcrest.number.IsCloseTo;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

/**
 * BigDecimal or Double matcher. We found some bugs in {@link MockMvcResultMatchers}. If you are using jsonPath()
 * sometimes it doesn't convert value from path to expected type. In that case it sometimes doesn't convert value to
 * Double, in some test it converts value to BigDecimal. This matcher determines type of item to match and redirects
 * call to one of Double or BigDecimal matcher. Use this class only if you have that problem with {@link
 * MockMvcResultMatchers}.
 */
public class BigDecimalOrDoubleMatcher extends BaseMatcher<Number> {

    private static final double DEFAULT_ACCURACY = 0.00001;
    private static final double BUILDING_ACCURACY = 0.00000000000000000001;

    private final double value;
    private final double accuracy;

    private BigDecimalOrDoubleMatcher(double value, double accuracy) {
        this.value = value;
        this.accuracy = accuracy;
    }

    /**
     * Matches big decimal or double with given accuracy.
     *
     * @param value    value
     * @param accuracy accuracy
     * @return BigDecimalOrDoubleMatcher
     */
    public static BigDecimalOrDoubleMatcher closeTo(double value, double accuracy) {
        return new BigDecimalOrDoubleMatcher(value, accuracy);
    }

    /**
     * Matches big decimal or double with {@link #DEFAULT_ACCURACY} accuracy.
     *
     * @param value value
     * @return BigDecimalOrDoubleMatcher
     */
    public static BigDecimalOrDoubleMatcher closeTo(double value) {
        return closeTo(value, DEFAULT_ACCURACY);
    }

    /**
     * Matches big decimal or double with {@link #BUILDING_ACCURACY} accuracy.
     *
     * @param value value
     * @return BigDecimalOrDoubleMatcher
     */
    public static BigDecimalOrDoubleMatcher buildingCloseTo(double value) {
        return closeTo(value, BUILDING_ACCURACY);
    }

    @Override
    public boolean matches(Object item) {
        if (item instanceof BigDecimal) {
            BigDecimal number = (BigDecimal) item;
            Matcher<BigDecimal> bigDecimalMatcher = BigDecimalCloseTo
                    .closeTo(BigDecimal.valueOf(value), BigDecimal.valueOf(accuracy));
            return bigDecimalMatcher.matches(number);
        } else if (item instanceof Double) {
            Matcher<Double> doubleMatcher = IsCloseTo.closeTo(value, accuracy);
            return doubleMatcher.matches(item);
        }
        return false;
    }

    @Override
    public void describeTo(Description description) {
        description.appendText("BigDecimal or Double matcher expected: " + value);
    }
}
