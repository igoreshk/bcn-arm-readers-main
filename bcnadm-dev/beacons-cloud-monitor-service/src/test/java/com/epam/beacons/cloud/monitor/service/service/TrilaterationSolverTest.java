package com.epam.beacons.cloud.monitor.service.service;

import com.epam.beacons.cloud.monitor.service.domain.TrilaterationData;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Tests for {@link TrilaterationSolver} class.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class TrilaterationSolverTest {

    @Autowired
    private TrilaterationSolver trilaterationSolver;

    @Test
    public void trilaterateTest_outOfArea() {
        TrilaterationData data = new TrilaterationData(1, 1, 40, 40);

        List<TrilaterationData> result = new ArrayList<>();
        result.add(data);

        trilaterationSolver.trilaterate(result);
    }
}
