package com.curable.service.dto.custom;

import java.util.List;

public class HistoryResponseDTO {

	private List<HistoryDTO> historyDTOS;
	private String currentStage;

	public HistoryResponseDTO() {
		super();
	}

	public HistoryResponseDTO(List<HistoryDTO> historyDTOS, String currentStage) {
		super();
		this.historyDTOS = historyDTOS;
		this.currentStage = currentStage;
	}

	public List<HistoryDTO> getHistoryDTOS() {
		return historyDTOS;
	}

	public void setHistoryDTOS(List<HistoryDTO> historyDTOS) {
		this.historyDTOS = historyDTOS;
	}

	public String getCurrentStage() {
		return currentStage;
	}

	public void setCurrentStage(String currentStage) {
		this.currentStage = currentStage;
	}

	@Override
	public String toString() {
		return "HistoryResponseDTO [historyDTOS=" + historyDTOS + ", currentStage=" + currentStage + "]";
	}

}
