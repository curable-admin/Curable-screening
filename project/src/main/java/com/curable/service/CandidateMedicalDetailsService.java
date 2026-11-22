package com.curable.service;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.curable.exception.BusinessException;
import com.curable.repository.CandidateMedicalDetailsRepository;
import com.curable.repository.CandidateRepository;
import com.curable.service.dto.CandidateMedicalDetailsDTO;
import com.curable.service.mapper.CandidateMedicalDetailsMapper;

@Service
@Transactional
public class CandidateMedicalDetailsService {

	@Autowired
	CandidateMedicalDetailsRepository candidateMedicalDetailsRepository;

	@Autowired
	CandidateMedicalDetailsMapper candidateMedicalDetailsMapper;

	@Autowired
	CandidateRepository candidateRepository;

	public Long saveMedicalHistoryForCandidate(CandidateMedicalDetailsDTO candidateMedicalDetailsDTO) {
		try {
			if ((candidateMedicalDetailsDTO.getMedicalhistory() != null
					&& candidateMedicalDetailsDTO.getMedicalhistory().toLowerCase().contains("cancer"))
					|| (candidateMedicalDetailsDTO.getCurrentlyPregant() != null
							&& candidateMedicalDetailsDTO.getCurrentlyPregant())) {
				String reason = candidateMedicalDetailsDTO.getMedicalhistory() != null
						&& candidateMedicalDetailsDTO.getCurrentlyPregant()
								? "Cancer & Currently Pregnant"
								: candidateMedicalDetailsDTO.getMedicalhistory() != null ? "Cancer"
										: candidateMedicalDetailsDTO.getCurrentlyPregant() ? "Currently Pregnant"
												: null;
				candidateRepository.markAsNoEvaluationNeeded(candidateMedicalDetailsDTO.getCandidateId(), reason);

			}

			return candidateMedicalDetailsRepository
					.save(candidateMedicalDetailsMapper.toEntity(candidateMedicalDetailsDTO)).getId();
		} catch (DataIntegrityViolationException ex) {
			throw new BusinessException("MEDICAL_HISTORY_ALREADY_EXISTS",
					"Medical history has already been modified by another user. Please refresh the page and try again.");
		}

	}

}
