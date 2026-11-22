package com.curable.report;

import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class ReportStrategyFactory {

	private final Map<String, ReportFactory> strategies;

	public ReportStrategyFactory(Map<String, ReportFactory> strategies) {
		this.strategies = strategies;
	}

	public ReportFactory getStrategy(String hospitalCode) {

		String beanName = hospitalCode + "ReportStrategy";

		ReportFactory strategy = strategies.get(beanName);

		if (strategy == null) {
			throw new UnsupportedOperationException("No report strategy found for hospital: " + hospitalCode);
		}

		return strategy;
	}

}
